import type { FetchMoreCallback } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadData(threadId: string): {
  ids: string[];
  fetchMore: FetchMoreCallback;
  loading: boolean;
  hasMore: boolean;
} {
  const [ids, setIds] = useState<string[]>([]);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const { sdk } = useCordContext('useCordThreadData');
  const messagesSDK = sdk?.experimental.messages;

  useEffect(() => {
    if (!messagesSDK) {
      return;
    }

    const key = messagesSDK.observeThreadData(
      threadId,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ ids, fetchMore, loading, hasMore }) => {
        setIds(ids);
        setFetchMore(() => fetchMore);
        setLoading(loading);
        setHasMore(hasMore);
      },
    );
    return () => {
      messagesSDK.unobserveThreadData(key);
    };
  }, [messagesSDK, threadId]);

  return { ids, fetchMore, loading, hasMore };
}
