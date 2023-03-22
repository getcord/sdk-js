import type {
  FetchMoreCallback,
  MessageSummary,
  ThreadData,
  ObserveThreadDataOptions,
} from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadData(
  threadId: string,
  options?: ObserveThreadDataOptions,
): ThreadData {
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [oldestMessage, setOldestMessage] = useState<
    MessageSummary | undefined
  >(undefined);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const { sdk } = useCordContext('useCordThreadData');
  const messagesSDK = sdk?.experimental.messages;

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
    if (!messagesSDK) {
      return;
    }

    const key = messagesSDK.observeThreadData(
      threadId,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ messages, oldestMessage, fetchMore, loading, hasMore }) => {
        setMessages(messages);
        setOldestMessage(oldestMessage);
        setFetchMore(() => fetchMore);
        setLoading(loading);
        setHasMore(hasMore);
      },
      optionsMemo,
    );
    return () => {
      messagesSDK.unobserveThreadData(key);
    };
  }, [messagesSDK, optionsMemo, threadId]);

  return { messages, oldestMessage, fetchMore, loading, hasMore };
}
