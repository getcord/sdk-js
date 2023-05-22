import type {
  ObserveThreadSummaryOptions,
  ThreadActivitySummary,
  ThreadSummary,
  Location,
  ObserveThreadDataOptions,
  ThreadData,
  MessageSummary,
  ObserveLocationDataOptions,
  LocationData,
  FetchMoreCallback,
  ObserveThreadActivitySummaryOptions,
} from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';

/**
 * This method allows you to observe summary information about a
 * [location](https://docs.cord.com/reference/location), including live updates.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const summary = thread.useLocationSummary(location, options);
 * ```
 * @example Usage
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const summary = thread.useLocationSummary({page: 'document_details'}, {partialMatch: true});
 * return (
 *   <div>
 *     {!summary && "Loading..."}
 *     {summary && (
 *       <p>Total threads: {summary.total}</p>
 *       <p>Unread threads: {summary.unread}</p>
 *       <p>Unread subscribed threads: {summary.unreadSubscribed}</p>
 *       <p>Resolved threads: {summary.resolved}</p>
 *     )}
 *   </div>
 * );
 * ```
 * @param location - The [location](https://docs.cord.com/reference/location) to
 * fetch summary information for.
 * @param options - Miscellaneous options. See below.
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useLocationSummary(
  location: Location,
  options?: ObserveThreadActivitySummaryOptions,
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

export function useLocationData(
  location: Location,
  options?: ObserveLocationDataOptions,
): LocationData {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );

  const { sdk } = useCordContext('useLocationData');
  const threadSDK = sdk?.thread;

  const locationString = locationJson(location);
  const optionsMemo = useMemo(
    () => ({
      sortBy: options?.sortBy,
      sortDirection: options?.sortDirection,
      includeResolved: options?.includeResolved,
    }),
    [options?.sortBy, options?.sortDirection, options?.includeResolved],
  );

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- use normalised location.
    const location = JSON.parse(locationString);

    const key = threadSDK.observeLocationData(
      location,
      // eslint-disable-next-line @typescript-eslint/no-shadow -- using to set shadowed vars.
      ({ threads, loading, hasMore, fetchMore }) => {
        setThreads(threads);
        setLoading(loading);
        setHasMore(hasMore);
        setFetchMore((_: unknown) => fetchMore);
      },
      optionsMemo,
    );
    return () => {
      threadSDK.unobserveLocationData(key);
    };
  }, [threadSDK, locationString, optionsMemo]);

  return { threads, loading, hasMore, fetchMore };
}

export function useThreadData(
  threadId: string,
  options?: ObserveThreadDataOptions,
): ThreadData {
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [firstMessage, setFirstMessage] = useState<MessageSummary | null>(null);
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
