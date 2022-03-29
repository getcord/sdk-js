import React, { useEffect, useMemo, useState } from 'react';

import { ICordSDK, Context } from '@cord-sdk/types';

type CordContextValue = {
  sdk: ICordSDK | null;
  context: Context | undefined;
  setContext: (context: Context | undefined) => unknown;
};

export const CordContext = React.createContext<CordContextValue>({
  sdk: null,
  context: undefined,
  setContext: () => undefined,
});

type Props = {
  sessionToken?: string | undefined | null;
  clientAuthToken?: string | undefined | null;
  enableTasks?: boolean;
  cordScriptUrl?: string;
};

export function CordProvider({
  sessionToken,
  clientAuthToken,
  enableTasks,
  cordScriptUrl,
  children,
}: React.PropsWithChildren<Props>) {
  const [sdk, setSDK] = useState<ICordSDK | null>(null);
  const [context, setContext] = useState<Context>();

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
    if (sdk && (sessionToken || clientAuthToken)) {
      const token = clientAuthToken || sessionToken;
      sdk
        .init({ client_auth_token: token!, enable_tasks: enableTasks })
        .then(() => {
          setSDK(sdk);
        });

      return () => {
        sdk.destroy();
      };
    } else {
      return undefined;
    }
  }, [sdk, sessionToken, clientAuthToken, enableTasks]);

  const value = useMemo<CordContextValue>(
    () => ({ sdk, context, setContext }),
    [sdk, context, setContext],
  );

  return <CordContext.Provider value={value}>{children}</CordContext.Provider>;
}
