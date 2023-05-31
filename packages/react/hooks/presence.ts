import { locationJson } from '@cord-sdk/types';
import type {
  Location,
  ObservePresenceOptions,
  UserLocationData,
} from '@cord-sdk/types';
import { useEffect, useMemo, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

export function useLocationData(
  location: Location,
  options: ObservePresenceOptions = {},
): Array<UserLocationData> | undefined {
  const { sdk } = useCordContext('presence.useLocationData');
  const presenceSDK = sdk?.presence;

  const locationString = locationJson(location);
  const optionsMemo = useMemo(
    () => ({
      partial_match: options?.partial_match,
      exclude_durable: options?.exclude_durable,
    }),
    [options?.partial_match, options?.exclude_durable],
  );

  const [presenceData, setPresenceData] = useState<Array<UserLocationData>>();

  useEffect(() => {
    if (!presenceSDK) {
      return;
    }
    const ref = presenceSDK.observeLocationData(
      JSON.parse(locationString),
      (data) => {
        setPresenceData(data);
      },
      optionsMemo,
    );

    return () => {
      presenceSDK.unobserveLocationData(ref);
    };
  }, [presenceSDK, locationString, optionsMemo]);

  return presenceData;
}
