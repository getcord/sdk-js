import type { ThreadSummary } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadSummary(id: string): ThreadSummary | null {
  const [summary, setSummary] = useState<ThreadSummary | null>(null);

  const { sdk } = useCordContext('useCordThreadSummary');
  const threadsSDK = sdk?.experimental.threads;

  useEffect(() => {
    if (!threadsSDK) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
    const key = threadsSDK.observeThreadSummary(id, (summary) =>
      setSummary(summary),
    );
    return () => {
      threadsSDK.unobserveThreadSummary(key);
    };
  }, [id, threadsSDK]);

  return summary;
}
