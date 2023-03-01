import type { FetchMoreCallback } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordMessageIDs(threadId: string): {
  ids: string[];
  fetchMore: FetchMoreCallback;
} {
  const [ids, setIds] = useState<string[]>([]);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    (_: unknown) => (_n: number) => {},
  );
  const { sdk } = useCordContext('useCordMessageIDs');
  const messagesSDK = sdk?.experimental.messages;

  useEffect(() => {
    if (!messagesSDK) {
      return;
    }

    const key = messagesSDK.observeMessageIDs(
      threadId,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ ids, fetchMore }) => {
        setIds(ids);
        setFetchMore((_: unknown) => fetchMore);
      },
    );
    return () => {
      messagesSDK.unobserveMessageIDs(key);
    };
  }, [messagesSDK, threadId]);

  return { ids, fetchMore };
}
