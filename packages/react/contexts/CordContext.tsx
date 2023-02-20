import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import type {
  AnnotationMode,
  BlurDisplayLocation,
  ICordSDK,
  Location,
  NavigateFn,
  InitErrorCallback,
  LoadCallback,
} from '@cord-sdk/types';

declare const CORD_REACT_PACKAGE_VERSION: string;

type CordContextValue = {
  sdk: ICordSDK | null;
  location: Location | undefined;
  setLocation: (location: Location | undefined) => unknown;
  // True only if the `useContext(CordContext)` call is within the context provider.
  hasProvider: boolean;
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
});

type Props = {
  clientAuthToken: string | undefined | null;
  enableTasks?: boolean;
  enableAnnotations?: boolean;
  blurScreenshots?: boolean;
  showBlurredScreenshots?: BlurDisplayLocation;
  cordScriptUrl?: string;
  navigate?: NavigateFn | null;
  threadOptions?: ThreadOptions;
  /**
   * @deprecated The annotationMode prop has been reverted to enableAnnotations
   * `annotationMode: 'none'` should be replaced with `enableAnnotations: false`
   */
  annotationMode?: AnnotationMode;
  onLoad?: LoadCallback;
  onInitError?: InitErrorCallback;
};

type ThreadOptions = {
  additionalSubscribersOnCreate: string[];
};

export function CordProvider({
  clientAuthToken,
  enableTasks,
  enableAnnotations,
  blurScreenshots,
  showBlurredScreenshots,
  annotationMode,
  cordScriptUrl,
  navigate,
  threadOptions,
  children,
  onLoad,
  onInitError,
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
      sdk
        .init({
          client_auth_token: clientAuthToken,
          enable_tasks: enableTasks,
          enable_annotations: enableAnnotations ?? annotationMode !== 'none',
          blur_screenshots: blurScreenshots,
          show_blurred_screenshots: showBlurredScreenshots,
          navigate,
          react_package_version: CORD_REACT_PACKAGE_VERSION,
          thread_options: threadOptions
            ? {
                additional_subscribers_on_create:
                  threadOptions.additionalSubscribersOnCreate,
              }
            : undefined,
          onInitError,
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
    blurScreenshots,
    showBlurredScreenshots,
    annotationMode,
    navigate,
    onInitError,
    threadOptions,
  ]);

  useEffect(() => {
    return () => {
      sdk?.destroy();
    };
  }, [sdk]);

  const value = useMemo<CordContextValue>(
    () => ({
      sdk: initialized ? sdk : null,
      location,
      setLocation,
      hasProvider: true,
      lastInitialized,
    }),
    [sdk, initialized, location, setLocation, lastInitialized],
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
