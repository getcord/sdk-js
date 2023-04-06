import type {
  ObserveThreadSummaryOptions,
  ThreadSummary,
} from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useThreadSummary(
  id: string,
  options?: ObserveThreadSummaryOptions,
): ThreadSummary | null {
  const [summary, setSummary] = useState<ThreadSummary | null>(null);

  const { sdk } = useCordContext('useCordThreadSummary');
  const threadSDK = sdk?.thread;

  const locationString = options?.location
    ? locationJson(options.location)
    : undefined;
  const optionsMemo = useMemo(
    () => ({
      location: locationString ? JSON.parse(locationString) : undefined,
      threadName: options?.threadName,
    }),
    [locationString, options?.threadName],
  );

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    const key = threadSDK.observeThreadSummary(
      id,
      (newSummary) => setSummary(newSummary),
      optionsMemo,
    );
    return () => {
      threadSDK.unobserveThreadSummary(key);
    };
  }, [id, optionsMemo, threadSDK]);

  return summary;
}
