import { useContext, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { CordContext } from 'opensource/cord-sdk/packages/react/contexts/CordContext';
import { Context } from 'opensource/cord-sdk/packages/types';

export function useCordContext(newContext?: Context) {
  const { context, setContext } = useContext(CordContext);

  useEffect(() => {
    if (newContext && !isEqual(context, newContext)) {
      setContext(newContext);
    }
  }, [newContext, context, setContext]);

  useEffect(() => {
    return () => {
      setContext(undefined);
    };
  }, [setContext]);

  return newContext ?? context;
}
