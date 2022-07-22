import React, { useContext, useEffect, useMemo, useState } from 'react';

import type {
  BlurDisplayLocation,
  ICordSDK,
  Location,
  NavigateFn,
} from '@cord-sdk/types';

declare var CORD_REACT_PACKAGE_VERSION: string;

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
};

export function CordProvider({
  clientAuthToken,
  enableTasks,
  enableAnnotations,
  blurScreenshots,
  showBlurredScreenshots,
  cordScriptUrl,
  navigate,
  children,
}: React.PropsWithChildren<Props>) {
  const [sdk, setSDK] = useState<ICordSDK | null>(null);
  const [location, setLocation] = useState<Location>();
  const [initialized, setInitialized] = useState(false);

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
          enable_annotations: enableAnnotations,
          blur_screenshots: blurScreenshots,
          show_blurred_screenshots: showBlurredScreenshots,
          navigate,
          react_package_version: CORD_REACT_PACKAGE_VERSION,
        })
        .then(() => {
          setInitialized(true);
        });
    }
  }, [
    sdk,
    clientAuthToken,
    enableTasks,
    enableAnnotations,
    blurScreenshots,
    showBlurredScreenshots,
    navigate,
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
    }),
    [sdk, initialized, location, setLocation],
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
