import { useContext, useEffect } from 'react';
import isEqual from 'lodash/isEqual.js';

import type { Location } from '@cord-sdk/types';

import { CordContext } from '../contexts/CordContext';

export function useCordLocation(newLocation?: Location) {
  const { location, setLocation } = useContext(CordContext);

  useEffect(() => {
    if (newLocation && !isEqual(location, newLocation)) {
      setLocation(newLocation);
    }
  }, [newLocation, location, setLocation]);

  useEffect(() => {
    return () => {
      setLocation(undefined);
    };
  }, [setLocation]);

  return newLocation ?? location;
}

// For backwards compatibility, will be removed along with the deprecated context prop
export const useCordContext = useCordLocation;
