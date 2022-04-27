import { useContext, useEffect } from 'react';
import isEqual from 'lodash/isEqual.js';

import type { Context } from '@cord-sdk/types';

import { CordContext } from '../contexts/CordContext';

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
