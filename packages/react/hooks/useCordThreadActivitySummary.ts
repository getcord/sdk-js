import type { ThreadActivitySummary, Location } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';

type Options = {
  partialMatch?: boolean;
};

export function useCordThreadActivitySummary(
  location: Location,
  options?: Options,
): ThreadActivitySummary | undefined {
  const { sdk } = useCordContext('useCordThreadActivitySummary');
  const activitySDK = sdk?.activity;
  const memoizedLocation = useMemoizedLocation(location);

  const [summary, setSummary] = useState<ThreadActivitySummary>();

  const optionsMemo = useMemo(
    () => ({
      partialMatch: !!options?.partialMatch,
    }),
    [options?.partialMatch],
  );

  useEffect(() => {
    if (!activitySDK) {
      return;
    }

    const ref = activitySDK.observeThreadSummary(
      memoizedLocation,
      setSummary,
      optionsMemo,
    );

    return () => {
      activitySDK.unobserveThreadSummary(ref);
    };
  }, [activitySDK, memoizedLocation, optionsMemo]);

  return summary;
}
