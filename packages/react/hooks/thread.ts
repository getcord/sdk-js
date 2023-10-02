import type {
  ObserveThreadSummaryOptions,
  ThreadActivitySummary,
  ThreadSummary,
  ClientMessageData,
  Location,
  ObserveThreadDataOptions,
  ThreadData,
  ObserveLocationDataOptions,
  LocationData,
  FetchMoreCallback,
  ObserveThreadActivitySummaryOptions,
  SearchResultData,
  SearchOptionsType,
  ThreadObserverOptions,
  ClientThreadData,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoizedLocation } from './useMemoizedLocation';
import { useMemoObject } from './useMemoObject';

/**
 * This method allows you to observe summary information about a
 * [location](https://docs.cord.com/reference/location), including live updates.
 * @example Overview
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
 * @param options - Options that control which threads are returned.
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

  const optionsMemo = useMemoObject(options);

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

/**
 * This method allows you to observe summary information about a thread,
 * including live updates.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const summary = thread.useThreadSummary('my-awesome-thread-id');
 * return (
 *   <div>
 *     {!summary && "Loading..."}
 *     {summary && (
 *       <p>Total messages: {summary.total}</p>
 *       <p>Unread messages: {summary.unread}</p>
 *     )}
 *   </div>
 * );
 * ```
 * @param id - The thread ID to fetch summary information for. If a thread with
 * this ID does not exist, it will be created.
 * @param options - Options for creating new threads.
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useThreadSummary(
  id: string,
  options?: ObserveThreadSummaryOptions,
): ThreadSummary | null {
  const [summary, setSummary] = useState<ThreadSummary | null>(null);

  const { sdk } = useCordContext('useCordThreadSummary');
  const threadSDK = sdk?.thread;

  const optionsMemo = useMemoObject(options);

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

/**
 * This method allows you to observe detailed data about
 * a [location](https://docs.cord.com/reference/location),
 * including live updates.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const { threads, loading, hasMore, fetchMore } = thread.useLocationData({
 *   page: 'document_details',
 * });
 * return (
 *   <div>
 *     {threads.map((threadSummary) => (
 *       <div key={threadSummary.id}>
 *         Thread ID {threadSummary.id} has {threadSummary.total} messages!
 *       </div>
 *     ))}
 *     {loading ? (
 *       <div>Loading...</div>
 *     ) : hasMore ? (
 *       <div onClick={() => fetchMore(10)}>Fetch 10 more</div>
 *     ) : null}
 *   </div>
 * );
 * ```
 * @param location - The [location](https://docs.cord.com/reference/location)
 * to fetch data for.
 * @param options -  Miscellaneous options.
 * @returns The hook will return an object containing the fields described under
 * "Available Data" above. The component will automatically re-render if any of
 * the data changes, i.e., this data is always "live".
 */
export function useLocationData(
  location: Location,
  options?: ObserveLocationDataOptions,
): LocationData {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );

  const { sdk } = useCordContext('useLocationData');
  const threadSDK = sdk?.thread;

  const locationMemo = useMemoObject(location);
  const optionsMemo = useMemoObject(options);

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    const key = threadSDK.observeLocationData(
      locationMemo,
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
  }, [threadSDK, locationMemo, optionsMemo]);

  return { threads, loading, hasMore, fetchMore };
}

/**
 * This method allows you to observe detailed data about a thread, including
 * live updates.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const { messages, loading, hasMore, fetchMore } = thread.useThreadData('my-awesome-thread-id');
 *
 * return (
 *   <div>
 *     {messages.map((messageSummary) => (
 *       <div key={messageSummary.id}>
 *         Message ID {messageSummary.id} was created at {messageSummary.createdTimestamp}!
 *       </div>
 *     ))}
 *     {loading ? (
 *       <div>Loading...</div>
 *     ) : hasMore ? (
 *       <div onClick={() => fetchMore(10)}>Fetch 10 more</div>
 *     ) : null}
 *   </div>
 * );
 * ```
 * @param threadId - The thread ID to fetch data for. If a thread with this ID
 * does not exist, it will be created.
 * @param options - Options for creating new threads.
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useThreadData(
  threadId: string,
  options?: ObserveThreadDataOptions,
): ThreadData {
  const [messages, setMessages] = useState<ClientMessageData[]>([]);
  const [firstMessage, setFirstMessage] = useState<ClientMessageData | null>(
    null,
  );
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const { sdk } = useCordContext('useCordThreadData');
  const threadSDK = sdk?.thread;

  const optionsMemo = useMemoObject(options);

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

/**
 * This hook allows you to observe message and summary data about a thread, including
 * live updates.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const { messages, summary, loading, hasMore, fetchMore } = thread.useThread('my-awesome-thread-id');
 *
 * return (
 *   <div>
 *     {summary ?
 *       <p> {summary.unread} / {summary.total} unread messages </p>
 *       : null}
 *     {messages.map((messageSummary) => (
 *       <div key={messageSummary.id}>
 *         Message ID {messageSummary.id} was created at {messageSummary.createdTimestamp}!
 *       </div>
 *     ))}
 *     {loading ? (
 *       <div>Loading...</div>
 *     ) : hasMore ? (
 *       <div onClick={() => fetchMore(10)}>Fetch 10 more</div>
 *     ) : null}
 *   </div>
 * );
 * ```
 * @param threadID - The thread ID to fetch data for. If a thread with this ID
 * does not exist, it will be created.
 * @param options - Options for creating new threads.
 * @returns The hook will initially return `loading: true`, initial values for
 * pagination information and messages, and summary will be undefined while the
 * data loads from our API. Once it has loaded, your component will re-render
 * and the hook will return an object containing the fields described under
 * "Available Data" above. The component will automatically re-render if any of
 * the data changes, i.e., this data is always "live".
 */
export function useThread(
  threadID: string,
  options?: ThreadObserverOptions,
): ClientThreadData {
  const [messages, setMessages] = useState<ClientMessageData[]>([]);
  const [summary, setSummary] = useState<ThreadSummary | undefined>();
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const { sdk } = useCordContext('useCordThread');
  const threadSDK = sdk?.thread;

  const optionsMemo = useMemoObject(options);

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    const key = threadSDK.observeThread(
      threadID,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ messages, summary, fetchMore, loading, hasMore }) => {
        setMessages(messages);
        setSummary(summary);
        setFetchMore(() => fetchMore);
        setLoading(loading);
        setHasMore(hasMore);
      },
      optionsMemo,
    );
    return () => {
      threadSDK.unobserveThread(key);
    };
  }, [threadSDK, optionsMemo, threadID]);

  return { messages, summary, fetchMore, loading, hasMore };
}

/**
 * This method allows you search for messages by content.
 * @example Overview
 * ```javascript
 * import { thread } from '@cord-sdk/react';
 * const results = thread.useSearchMessages({textToMatch: 'hello'});
 *
 * return (
 *   <div>
 *     {results.map((result) => (
 *       <div key={result.id}>
 *         Found match in message {result.id}: {result.plaintext}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 * @param searchOptions - Various options for how to search the messages.  Each
 * option is optional, but if you supply no options the result will be an empty
 * array.
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an array containing message objects including thread location.
 *
 * Please note that the results are limited to 50 messages. To get more
 * specific results, consider using one or more of the other search options provided.
 */
export function useSearchMessages(
  searchOptions: SearchOptionsType,
): SearchResultData[] | undefined {
  const [data, setData] = useState<SearchResultData[] | undefined>(undefined);
  const { textToMatch, authorID, orgID, locationOptions, timestampRange } =
    searchOptions;
  const inputsMemo = useMemoObject({
    textToMatch,
    authorID,
    locationOptions,
    orgID,
    timestampRange,
  });

  const { sdk } = useCordContext('useSearchMessages');
  const threadSDK = sdk?.thread;

  useEffect(() => {
    if (!threadSDK) {
      return;
    }

    threadSDK
      .searchMessages(inputsMemo)
      .then((result) => {
        setData(result);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [threadSDK, textToMatch, authorID, inputsMemo]);

  return data;
}
