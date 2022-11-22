import type { ThreadActivitySummary, Location } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';

export function useCordThreadActivitySummary(
  location: Location,
): ThreadActivitySummary | undefined {
  const { sdk } = useCordContext('useCordThreadActivitySummary');
  const activitySDK = sdk?.activity;

  const memoizedLocation = useMemoizedLocation(location);

  const [summary, setSummary] = useState<ThreadActivitySummary>();

  useEffect(() => {
    if (!activitySDK) {
      return;
    }

    const ref = activitySDK.observeThreadSummary(memoizedLocation, setSummary);

    return () => {
      activitySDK.unobserveThreadSummary(ref);
    };
  }, [activitySDK, memoizedLocation]);

  return summary;
}
