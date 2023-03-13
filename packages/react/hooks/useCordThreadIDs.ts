import type { Location, FetchMoreCallback } from '@cord-sdk/types';
import { locationJson } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useCordThreadIDs(location: Location): {
  ids: string[];
  fetchMore: FetchMoreCallback;
} {
  const [ids, setIds] = useState<string[]>([]);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );
  const { sdk } = useCordContext('useCordThreadIDs');
  const dumpingGroundSDK = sdk?.experimental.dumpingGround;

  // Turn location into a string, which won't change even if location isn't
  // memoized, to avoid rerenders / infinite loop.
  const locationString = locationJson(location);

  useEffect(() => {
    if (!dumpingGroundSDK) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
    const location = JSON.parse(locationString);

    // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
    const key = dumpingGroundSDK.observeThreadIDs(
      location,
      // eslint-disable-next-line @typescript-eslint/no-shadow -- Disabling for pre-existing problems. Please do not copy this comment, and consider fixing this one!
      ({ ids, fetchMore }) => {
        setIds(ids);
        setFetchMore((_: unknown) => fetchMore);
      },
    );
    return () => {
      dumpingGroundSDK.unobserveThreadIDs(key);
    };
  }, [dumpingGroundSDK, locationString]);

  return { ids, fetchMore };
}
