import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import type { i18n } from 'i18next';

import type {
  AnnotationMode,
  BlurDisplayLocation,
  ICordSDK,
  Location,
  NavigateFn,
  InitErrorCallback,
  LoadCallback,
  ScreenshotOptions as SnakeCaseScreenshotOptions,
  JsonObject,
  Translations,
  CordSDKOptions,
  CaptureScreenshotEvent,
} from '@cord-sdk/types';
import { useUnpackClientAuthTokenPayload } from '../hooks/useUnpackClientAuthTokenPayload.ts';

declare const CORD_REACT_PACKAGE_VERSION: string;

// To avoid having to depend on i18next in @cord-sdk/types just for typing, we
// declare the field in this module, where we already depend on i18next.
declare module '@cord-sdk/types' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ICordSDK {
    readonly i18n: i18n;
  }
}

export type CordContextValue = {
  sdk: ICordSDK | null;
  location: Location | undefined;
  setLocation: (location: Location | undefined) => unknown;
  // True only if the `useContext(CordContext)` call is within the context provider.
  hasProvider: boolean;
  clientAuthToken: string | undefined;
  userID: string | undefined;
  organizationID: string | undefined;
};

let shouldLogLoadingTime = false;
let overrideCordScriptUrl: string | null = null;
try {
  shouldLogLoadingTime = !!localStorage.getItem('__cord_log_loading_times__');
  overrideCordScriptUrl = localStorage.getItem('__cord_override_script_url__');
} catch {
  // localStorage for some reason not available
}

export const CordContext = React.createContext<CordContextValue>({
  sdk: null,
  location: undefined,
  setLocation: () => undefined,
  hasProvider: false,
  clientAuthToken: undefined,
  userID: undefined,
  organizationID: undefined,
});

type Props = {
  clientAuthToken: string | undefined | null;
  enableTasks?: boolean;
  enableAnnotations?: boolean;
  enableSlack?: boolean;
  cordScriptUrl?: string;
  navigate?: NavigateFn | null;
  threadOptions?: ThreadOptions;
  /**
   * Please use the camelCase version of the options.
   */
  screenshotOptions?: ScreenshotOptions & SnakeCaseScreenshotOptions;
  customRenderers?: Record<string, (m: Record<string, unknown>) => HTMLElement>;
  /**
   * @deprecated The annotationMode prop has been reverted to enableAnnotations
   * `annotationMode: 'none'` should be replaced with `enableAnnotations: false`
   */
  annotationMode?: AnnotationMode;
  onLoad?: LoadCallback;
  onInitError?: InitErrorCallback;

  /** @deprecated use `screenshotOptions.blur` instead */
  blurScreenshots?: boolean;
  /** @deprecated use `screenshotOptions.showBlurred` instead */
  showBlurredScreenshots?: BlurDisplayLocation;
  /** @deprecated use `screenshotOptions.capture` instead */
  enableScreenshotCapture?: boolean;
  customEventMetadata?: JsonObject;
  translations?: Translations;
  language?: string;
  beforeMessageCreate?: CordSDKOptions['beforeMessageCreate'];
};

type ThreadOptions = {
  additionalSubscribersOnCreate: string[];
};

// Camel case version of @cord-sdk/types ScreenshotOptions
type ScreenshotOptions = {
  blur?: boolean;
  showBlurred?: BlurDisplayLocation;
  captureWhen?: CaptureScreenshotEvent[];
  showScreenshot?: boolean;
};

export function CordProvider({
  clientAuthToken,
  enableTasks,
  enableAnnotations,
  enableSlack,
  blurScreenshots,
  enableScreenshotCapture,
  showBlurredScreenshots,
  screenshotOptions,
  customRenderers,
  annotationMode,
  cordScriptUrl,
  navigate,
  threadOptions,
  children,
  onLoad,
  onInitError,
  customEventMetadata,
  translations,
  language,
  beforeMessageCreate,
}: React.PropsWithChildren<Props>) {
  if (clientAuthToken?.length === 0) {
    console.warn(
      `CordProvider was given an empty string as token. Cord components will not be rendered.`,
    );
  }
  const [sdk, setSDK] = useState<ICordSDK | null>(null);
  const [location, setLocation] = useState<Location>();
  const [lastInitialized, setLastInitialized] = useState<number>();
  const initialized = lastInitialized !== undefined;

  const scriptInjectedRef = useRef<number>();

  useEffect(() => {
    if (shouldLogLoadingTime) {
      console.log('<CordProvider> first render', new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    if (shouldLogLoadingTime && clientAuthToken) {
      console.log('<CordProvider> token defined', new Date().toISOString());
    }
  }, [clientAuthToken]);

  useEffect(() => {
    if (onLoad) {
      if (window.CordSDK) {
        onLoad(window.CordSDK);
      } else {
        window.addEventListener('cord:load', () => {
          onLoad(window.CordSDK!);
        });
      }
    }
  }, [onLoad]);

  useEffect(() => {
    if (window.CordSDK) {
      setSDK(window.CordSDK);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
    const onLoad = () => {
      if (shouldLogLoadingTime) {
        console.log(`<CordProvider> script loaded`, new Date().toISOString());
        if (scriptInjectedRef.current) {
          console.log(
            `<CordProvider> script load time: ${
              Date.now() - scriptInjectedRef.current
            }ms`,
          );
        }
      }

      if (!window.CordSDK) {
        console.warn('CordSDK failed to load');
        return;
      }

      setSDK(window.CordSDK);
    };

    const scriptTag = document.createElement('script');
    scriptTag.src =
      overrideCordScriptUrl ??
      cordScriptUrl ??
      `https://app.cord.com/sdk/v1/sdk.latest.js`;
    scriptTag.addEventListener('load', onLoad);
    document.head.appendChild(scriptTag);

    if (shouldLogLoadingTime) {
      scriptInjectedRef.current = Date.now();
      console.log('<CordProvider> script injected', new Date().toISOString());
    }

    return () => {
      scriptTag.removeEventListener('load', onLoad);
      scriptTag.remove();
    };
  }, [cordScriptUrl]);

  useEffect(() => {
    if (sdk && clientAuthToken) {
      // All screenshotOptions.snake_case props have been deprecated
      // in favour of screenshotOptions.camelCase. We also support
      // even older deprecated props, like `enableScreenshotCapture`
      const deprecatedEnableScreenshotCapture =
        enableScreenshotCapture === false ? [] : undefined;
      const backwardsCompatibleScreenshotOptions: SnakeCaseScreenshotOptions = {
        blur: screenshotOptions?.blur ?? blurScreenshots,
        capture_when:
          screenshotOptions?.captureWhen ??
          screenshotOptions?.capture_when ??
          deprecatedEnableScreenshotCapture,
        show_blurred:
          screenshotOptions?.showBlurred ??
          screenshotOptions?.show_blurred ??
          showBlurredScreenshots,
        show_screenshot:
          screenshotOptions?.showScreenshot ??
          screenshotOptions?.show_screenshot,
      };
      void sdk
        .init({
          client_auth_token: clientAuthToken,
          enable_tasks: enableTasks,
          enable_annotations: enableAnnotations ?? annotationMode !== 'none',
          enable_slack: enableSlack,
          navigate,
          react_package_version: CORD_REACT_PACKAGE_VERSION,
          thread_options: threadOptions
            ? {
                additional_subscribers_on_create:
                  threadOptions.additionalSubscribersOnCreate,
              }
            : undefined,
          screenshot_options: backwardsCompatibleScreenshotOptions,
          custom_event_metadata: customEventMetadata,
          onInitError,
          custom_renderers: customRenderers,
          translations,
          language,
          beforeMessageCreate,
        })
        .then(() => {
          setLastInitialized(Date.now());
        });
    }
  }, [
    sdk,
    clientAuthToken,
    enableTasks,
    enableAnnotations,
    enableSlack,
    blurScreenshots,
    showBlurredScreenshots,
    annotationMode,
    navigate,
    onInitError,
    threadOptions,
    enableScreenshotCapture,
    screenshotOptions,
    customRenderers,
    customEventMetadata,
    translations,
    language,
    beforeMessageCreate,
  ]);

  useEffect(() => {
    return () => {
      sdk?.destroy();
    };
  }, [sdk]);

  const { userID, organizationID } =
    useUnpackClientAuthTokenPayload(clientAuthToken);

  const value = useMemo<CordContextValue>(
    () => ({
      sdk: initialized ? sdk : null,
      location,
      setLocation,
      hasProvider: true,
      lastInitialized,
      clientAuthToken: clientAuthToken === null ? undefined : clientAuthToken,
      userID,
      organizationID,
    }),
    [
      sdk,
      initialized,
      location,
      setLocation,
      lastInitialized,
      clientAuthToken,
      userID,
      organizationID,
    ],
  );

  return <CordContext.Provider value={value}>{children}</CordContext.Provider>;
}

export function useCordContext(hook: string) {
  const { hasProvider, ...context } = useContext(CordContext);

  useEffect(() => {
    if (!hasProvider) {
      console.error(
        `[Cord SDK] The ${hook} hook is used in a component that is not a descendant of <CordProvider>.`,
      );
    }
  }, [hasProvider, hook]);

  return context;
}
