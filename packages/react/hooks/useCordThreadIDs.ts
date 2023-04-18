import type {
  Location,
  FetchMoreCallback,
  ThreadSummaries,
  ThreadSummary,
  ObserveThreadIDsOptions,
} from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadIDs(
  location: Location,
  options?: ObserveThreadIDsOptions,
): ThreadSummaries {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );

  const { sdk } = useCordContext('useCordThreadIDs');
  const dumpingGroundSDK = sdk?.experimental.dumpingGround;

  // Turn location into a string, which won't change even if location isn't
  // memoized, to avoid rerenders / infinite loop.
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
    if (!dumpingGroundSDK) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- use normalised location.
    const location = JSON.parse(locationString);

    const key = dumpingGroundSDK.observeThreadIDs(
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
      dumpingGroundSDK.unobserveThreadIDs(key);
    };
  }, [dumpingGroundSDK, locationString, optionsMemo]);

  return { threads, loading, hasMore, fetchMore };
}
