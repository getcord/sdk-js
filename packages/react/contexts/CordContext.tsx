import React, { useContext, useEffect, useMemo, useState } from 'react';

import type {
  AnnotationMode,
  BlurDisplayLocation,
  ICordSDK,
  Location,
  NavigateFn,
} from '@cord-sdk/types';

declare const CORD_REACT_PACKAGE_VERSION: string;

type CordContextValue = {
  sdk: ICordSDK | null;
  location: Location | undefined;
  setLocation: (location: Location | undefined) => unknown;
  // True only if the `useContext(CordContext)` call is within the context provider.
  hasProvider: boolean;
};

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
}: React.PropsWithChildren<Props>) {
  const [sdk, setSDK] = useState<ICordSDK | null>(null);
  const [location, setLocation] = useState<Location>();
  const [lastInitialized, setLastInitialized] = useState<number>();
  const initialized = lastInitialized !== undefined;

  useEffect(() => {
    if (window.CordSDK) {
      setSDK(window.CordSDK);
      return;
    }

    const onLoad = () => {
      if (!window.CordSDK) {
        console.warn('CordSDK failed to load');
        return;
      }

      setSDK(window.CordSDK);
    };

    const scriptTag = document.createElement('script');
    scriptTag.src =
      cordScriptUrl ?? `https://app.cord.com/sdk/v1/sdk.latest.js`;
    scriptTag.addEventListener('load', onLoad);
    document.head.appendChild(scriptTag);

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
