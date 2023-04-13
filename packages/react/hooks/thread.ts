import type {
  ObserveThreadSummaryOptions,
  ThreadActivitySummary,
  ThreadSummary,
  Location,
  ObserveThreadDataOptions,
  ThreadData,
  MessageSummary,
  FetchMoreCallback,
} from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';

type Options = {
  partialMatch?: boolean;
};

export function useLocationSummary(
  location: Location,
  options?: Options,
): ThreadActivitySummary | undefined {
  const { sdk } = useCordContext('thread.useLocationSummary');
  const threadSDK = sdk?.thread;
  const memoizedLocation = useMemoizedLocation(location);

  const [summary, setSummary] = useState<ThreadActivitySummary>();

  const optionsMemo = useMemo(
    () => ({
      partialMatch: !!options?.partialMatch,
    }),
    [options?.partialMatch],
  );

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    const ref = threadSDK.observeLocationSummary(
      memoizedLocation,
      setSummary,
      optionsMemo,
    );

    return () => {
      threadSDK.unobserveLocationSummary(ref);
    };
  }, [threadSDK, memoizedLocation, optionsMemo]);

  return summary;
}

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

export function useThreadData(
  threadId: string,
  options?: ObserveThreadDataOptions,
): ThreadData {
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [firstMessage, setFirstMessage] = useState<MessageSummary | undefined>(
    undefined,
  );
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const { sdk } = useCordContext('useCordThreadData');
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

    const key = threadSDK.observeThreadData(
      threadId,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ messages, firstMessage, fetchMore, loading, hasMore }) => {
        setMessages(messages);
        setFirstMessage(firstMessage);
        setFetchMore(() => fetchMore);
        setLoading(loading);
        setHasMore(hasMore);
      },
      optionsMemo,
    );
    return () => {
      threadSDK.unobserveThreadData(key);
    };
  }, [threadSDK, optionsMemo, threadId]);

  return { messages, firstMessage, fetchMore, loading, hasMore };
}
