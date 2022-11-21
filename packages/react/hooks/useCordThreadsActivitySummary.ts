import type { ThreadsActivitySummary, Location } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';

export function useCordThreadsActivitySummary(
  location: Location,
): ThreadsActivitySummary | undefined {
  const { sdk } = useCordContext('useCordThreadsSummary');
  const activitySDK = sdk?.activity;

  const memoizedLocation = useMemoizedLocation(location);

  const [summary, setSummary] = useState<ThreadsActivitySummary>();

  useEffect(() => {
    if (!activitySDK) {
      return;
    }

    const ref = activitySDK.observeThreadsSummary(memoizedLocation, setSummary);

    return () => {
      activitySDK.unobserveThreadsSummary(ref);
    };
  }, [activitySDK, memoizedLocation]);

  return summary;
}
