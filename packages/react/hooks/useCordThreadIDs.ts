import type { Location, ThreadIDsFetchMoreCallback } from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadIDs(location: Location): {
  ids: string[];
  fetchMore: ThreadIDsFetchMoreCallback;
} {
  const [ids, setIds] = useState<string[]>([]);
  const [fetchMore, setFetchMore] = useState<ThreadIDsFetchMoreCallback>(
    (_: unknown) => (_: number) => {},
  );
  const { sdk } = useCordContext('useCordThreadIDs');
  const threadsSDK = sdk?.experimental.threads;

  // Turn location into a string, which won't change even if location isn't
  // memoized, to avoid rerenders / infinite loop.
  const locationString = locationJson(location);

  useEffect(() => {
    if (!threadsSDK) {
      return;
    }

    const location = JSON.parse(locationString);

    const key = threadsSDK.observeThreadIDs(location, ({ ids, fetchMore }) => {
      setIds(ids);
      setFetchMore((_: unknown) => fetchMore);
    });
    return () => {
      threadsSDK.unobserveThreadIDs(key);
    };
  }, [threadsSDK, locationString]);

  return { ids, fetchMore };
}
