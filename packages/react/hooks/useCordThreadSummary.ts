import type { ThreadSummary } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadSummary(id: string): ThreadSummary | null {
  const [summary, setSummary] = useState<ThreadSummary | null>(null);

  const { sdk } = useCordContext('useCordThreadSummary');
  const threadSDK = sdk?.thread;

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
    const key = threadSDK.observeThreadSummary(id, (summary) =>
      setSummary(summary),
    );
    return () => {
      threadSDK.unobserveThreadSummary(key);
    };
  }, [id, threadSDK]);

  return summary;
}
