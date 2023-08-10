import type {
  Location,
  ObservePresenceOptions,
  UserLocationData,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useMemoObject } from './useMemoObject';

/**
 * This method allows you to observe users who are
 * [present](https://docs.cord.com/js-apis-and-hooks/presence-api) at a
 * particular [location](https://docs.cord.com/reference/location), including
 * live updates.
 * @example Overview
 * ```javascript
 * import { presence } from '@cord-sdk/react';
 * const present = presence.useLocationData(
 *   { page: "https://cord.com", block: "id123" },
 *   { exclude_durable: true },
 * );
 * return (
 *   <>
 *     {present.map((user) => <div>{user.id} is present!</div>)}
 *   </>
 * );
 * ```
 * @param location - The [location](https://docs.cord.com/reference/location) to
 * fetch presence information for.
 * @param options - Options that control which presence records are returned.
 * @returns An array of objects, one for each user present at the
 * [location](https://docs.cord.com/reference/location) which was passed to this
 * hook. Each object will contain the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useLocationData(
  location: Location,
  options: ObservePresenceOptions = {},
): Array<UserLocationData> | undefined {
  const { sdk } = useCordContext('presence.useLocationData');
  const presenceSDK = sdk?.presence;

  const optionsMemo = useMemoObject(options);
  const locationMemo = useMemoObject(location);

  const [presenceData, setPresenceData] = useState<Array<UserLocationData>>();

  useEffect(() => {
    if (!presenceSDK) {
      return;
    }
    const ref = presenceSDK.observeLocationData(
      locationMemo,
      (data) => {
        setPresenceData(data);
      },
      optionsMemo,
    );

    return () => {
      presenceSDK.unobserveLocationData(ref);
    };
  }, [presenceSDK, locationMemo, optionsMemo]);

  return presenceData;
}
