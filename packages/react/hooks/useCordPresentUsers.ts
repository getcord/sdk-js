import { locationJson } from '@cord-sdk/types';
import type {
  User,
  UserLocationData,
  Location,
  ListenerRef,
  UserPresenceInformation,
} from '@cord-sdk/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

type Options = {
  excludeViewer?: boolean;
  onlyPresentUsers?: boolean;
  exactMatch?: boolean;
  includeUserDetails?: boolean;
};

export function useCordPresentUsers(
  location: Location,
  options: Options = {},
): Array<User & UserPresenceInformation> {
  const {
    excludeViewer = false,
    includeUserDetails = false,
    onlyPresentUsers = false,
    exactMatch = false,
  } = options;

  const { sdk } = useCordContext('useCordPresentUsers');
  const presenceSDK = sdk?.presence;
  const usersSDK = sdk?.users;

  const locationString = locationJson(location);

  const [userLocations, setUserLocations] = useState<
    Record<string, UserLocationData>
  >({});
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const userDetailsRef = useRef<Record<string, User>>({});
  userDetailsRef.current = userDetails;

  const [viewerID, setViewerID] = useState<string>();

  useEffect(() => {
    if (!presenceSDK) {
      return;
    }

    const location = JSON.parse(locationString);
    let current = true;

    const listenerRef = presenceSDK.addListener(
      (userLocationUpdate) => {
        if (!current) {
          return;
        }

        setUserLocations((userLocations) => ({
          ...userLocations,
          [userLocationUpdate.id]: {
            ...userLocations[userLocationUpdate.id],
            ...userLocationUpdate,
          },
        }));
      },
      location,
      { exact_match: exactMatch },
    );

    presenceSDK
      .getPresent(location, {
        exact_match: exactMatch,
        exclude_durable: onlyPresentUsers,
      })
      .then((userLocationDataList) => {
        if (current) {
          setUserLocations(
            Object.fromEntries(
              userLocationDataList.map((data) => [data.id, data]),
            ),
          );
        }
      });

    return () => {
      current = false;
      presenceSDK.removeListener(listenerRef);
    };
  }, [presenceSDK, locationString, exactMatch, onlyPresentUsers]);

  const userDetailsListenersRef = useRef(new Map<string, ListenerRef>());
  const mountedRef = useRef(true);

  const currentUserIDs = useMemo(
    () => new Set(Object.keys(userLocations)),
    [userLocations],
  );

  useEffect(() => {
    if (!usersSDK || !includeUserDetails) {
      return;
    }

    mountedRef.current = true;

    // make sure all current user IDs are being observed
    for (const id of currentUserIDs) {
      if (!userDetailsListenersRef.current.has(id)) {
        const listenerRef = usersSDK.addUserListener(id, (user) => {
          if (mountedRef.current) {
            setUserDetails((userDetails) => ({
              ...userDetails,
              [user.id]: user,
            }));
          }
        });

        userDetailsListenersRef.current.set(id, listenerRef);
      }
    }

    for (const [id, ref] of userDetailsListenersRef.current.entries()) {
      if (!currentUserIDs.has(id)) {
        usersSDK.removeUserListener(ref);
        userDetailsListenersRef.current.delete(id);
      }
    }
  }, [usersSDK, currentUserIDs, includeUserDetails]);

  useEffect(() => {
    if (!usersSDK) {
      return;
    }

    mountedRef.current = true;

    // fetch viewer details on mount
    usersSDK.getViewerID().then((id) => {
      if (mountedRef.current) {
        setViewerID(id);
      }
    });

    // remove user listeners on unmount
    const listeners = userDetailsListenersRef.current;
    return () => {
      mountedRef.current = false;
      for (const ref of listeners.values()) {
        usersSDK.removeUserListener(ref);
      }
    };
  }, [usersSDK]);

  return useMemo<Array<User & UserPresenceInformation>>(() => {
    if (excludeViewer && viewerID === undefined) {
      // if we're supposed to exclude the viewer, don't return anything
      // until we know who that is
      return [];
    }

    const now = new Date();

    return Object.entries(userLocations)
      .filter(([id, locationData]) => {
        if (excludeViewer && viewerID === id) {
          // exclude the viewer if requested
          return false;
        }

        if (includeUserDetails && !userDetails[id]) {
          // exclude users whose details we don't have yet
          return false;
        }

        const present = Boolean(locationData.ephemeral?.locations?.length);
        if (onlyPresentUsers && !present) {
          // if the user isn't present in any location for this matcher
          return false;
        }

        return true;
      })
      .map(([id, locationData]) => ({
        ...(includeUserDetails
          ? userDetails[id]
          : {
              name: null,
              firstName: null,
              lastName: null,
              profilePictureURL: null,
            }),
        id,
        present: Boolean(locationData.ephemeral?.locations?.length),
        lastPresent: locationData.durable?.timestamp ?? now,
        presentLocations: locationData.ephemeral?.locations ?? [],
      }))
      .sort((u1, u2) => {
        if (u1.present && !u2.present) {
          // present users go before not present ones
          return -1;
        } else if (!u1.present && u2.present) {
          // present users go before not present ones
          return 1;
        } else if (!u1.present && !u2.present) {
          // both users are absent, order by lastPresent
          return u2.lastPresent.getTime() - u1.lastPresent.getTime();
        } else {
          // both users are present, place the viewer first if one of the users is
          if (u1.id === viewerID) {
            return -1;
          } else if (u2.id === viewerID) {
            return 1;
          } else {
            // neither is the viewer, order by id so that the list of present users
            // is stable (people don't jump around if they update their presence often)
            return u1.id < u2.id ? -1 : 1;
          }
        }
      });
  }, [
    userLocations,
    userDetails,
    viewerID,
    excludeViewer,
    includeUserDetails,
    onlyPresentUsers,
  ]);
}
