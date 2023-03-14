import type {
  FetchMoreCallback,
  MessageSummary,
  ThreadData,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadData(threadId: string): ThreadData {
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
    );
    return () => {
      messagesSDK.unobserveThreadData(key);
    };
  }, [messagesSDK, threadId]);

  return { messages, oldestMessage, fetchMore, loading, hasMore };
}
