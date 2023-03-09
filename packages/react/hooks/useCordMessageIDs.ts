import type { FetchMoreCallback } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordMessageIDs(threadId: string): {
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

  const { sdk } = useCordContext('useCordMessageIDs');
  const messagesSDK = sdk?.experimental.messages;

  useEffect(() => {
    if (!messagesSDK) {
      return;
    }

    const key = messagesSDK.observeMessageIDs(
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
      messagesSDK.unobserveMessageIDs(key);
    };
  }, [messagesSDK, threadId]);

  return { ids, fetchMore, loading, hasMore };
}
