import * as React from 'react';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LiveCursorsCursorPosition } from '@cord-sdk/types';
import {
  type LiveCursorsEventToLocationFn,
  type LiveCursorsLocationToDocumentFn,
  type Location,
  isEqualLocation,
} from '@cord-sdk/types';

import { useCordLocation } from '../hooks/useCordLocation';
import { user } from '..';
import { useCordContext } from '../contexts/CordContext';
import { POSITION_UPDATE_INTERVAL_MS } from './LiveCursors.css';
import {
  LiveCursorsDefaultCursor,
  type LiveCursorsCursorProps,
} from './LiveCursorsDefaultCursor';

export type LiveCursorsReactComponentProps = {
  location?: Location;
  organizationID?: string;
  showViewerCursor?: boolean;
  translations?: {
    eventToLocation: LiveCursorsEventToLocationFn;
    locationToDocument: LiveCursorsLocationToDocumentFn;
  };
  cursorComponent?: FunctionComponent<LiveCursorsCursorProps>;
};

/**
 * Default translation function to convert a MouseEvent into a serialized
 * location.  The primary data we try to use is from
 * `CordSDK.annotation.viewportCoordinatesToString`. That's not always available
 * though, so we also transmit absolute x/y coordinates.
 */
export async function defaultEventToLocation(e: MouseEvent): Promise<Location> {
  const annotationSDK = window.CordSDK?.annotation;
  const s = await annotationSDK?.viewportCoordinatesToString({
    x: e.clientX,
    y: e.clientY,
  });

  const annotationObj: Record<string, string> = s
    ? { __cord_annotation: s }
    : {};

  return {
    __cord_cursor_x: e.pageX,
    __cord_cursor_y: e.pageY,
    ...annotationObj,
  };
}

/**
 * Default translation function to convert a Location into x/y coordinates. This
 * primarily tries to use `CordSDK.annotation.stringToViewportCoordinates` to
 * get coordinates, if that data is available and the Cord SDK can find a
 * suitable element that it references. If that doesn't work, fall back on x/y
 * coordinates, which should always be present.
 */
export async function defaultLocationToDocument(
  location: Location,
): Promise<LiveCursorsCursorPosition> {
  const annotationSDK = window.CordSDK?.annotation;
  if ('__cord_annotation' in location && annotationSDK) {
    const coords = await annotationSDK.stringToViewportCoordinates(
      String(location.__cord_annotation),
    );
    if (coords) {
      return {
        x: coords.x,
        y: coords.y,
      };
    }
  }

  if ('__cord_cursor_x' in location && '__cord_cursor_y' in location) {
    return {
      x: location.__cord_cursor_x as number,
      y: location.__cord_cursor_y as number,
    };
  }

  return null;
}

type CursorPosition = NonNullable<LiveCursorsCursorPosition>;

// A secret param passed to a few API functions which only affects Cord's
// logging. Feel free to remove this if you're modifying this code in your own
// app.
const cordInternal: any = {
  __cordInternal: true,
};

export function LiveCursors({
  location: locationProp,
  organizationID,
  showViewerCursor,
  translations,
  cursorComponent,
  ...remainingProps
}: LiveCursorsReactComponentProps) {
  // Make sure we've covered all the props we say we take; given the layers of
  // type generics etc it's easy to forget something.
  const _: Record<string, never> = remainingProps;

  const contextLocation = useCordLocation();
  const locationInput = locationProp ?? contextLocation;
  if (!locationInput) {
    throw new Error('cord-live-cursors: missing location');
  }

  const eventToLocation =
    translations?.eventToLocation ?? defaultEventToLocation;
  const locationToDocument =
    translations?.locationToDocument ?? defaultLocationToDocument;

  // The "base" location for all of our presence updates. We transmit our cursor
  // position by encoding our cursor information into a sub-location of this and
  // setting ourselves as present there (setting this base location as
  // "exclusive within" to clear our presence at any other such sub-locations).
  // Then we get others' cursor positions by looking for others present at this
  // base location, using partial matching so that we get back all of the
  // sub-locations with their cursor information encoded.
  const baseLocation = useMemo(
    () => ({
      ...locationInput,
      __cord_live_cursors: true,
    }),
    [locationInput],
  );

  useSendCursor(baseLocation, eventToLocation, organizationID);

  const userCursors = useUserCursors(
    baseLocation,
    locationToDocument,
    !!showViewerCursor,
    organizationID,
  );

  // Load detailed information for each user whose cursor we have, so we can
  // display their name etc.
  const users = user.useUserData(Object.keys(userCursors));
  const viewerID = useViewerID();

  // Combine the userCursors user ID and position info with the detailed user
  // information to produce the information Cursor needs to actually render.
  const result = useMemo<LiveCursorsCursorProps[]>(() => {
    if (viewerID === undefined) {
      // Skip if we don't know who the viewer is, since we don't want to show
      // them their own cursor.
      return [];
    }

    return Object.keys(userCursors)
      .filter((id) => userCursors[id] && users[id])
      .map((id) => ({
        user: users[id]!,
        pos: userCursors[id]!,
      }));
  }, [users, userCursors, viewerID]);

  const Cursor = cursorComponent ?? LiveCursorsDefaultCursor;

  return (
    <>
      {result.map((props) => (
        <Cursor key={props.user.id} {...props} />
      ))}
    </>
  );
}

function useViewerID() {
  const viewerData = user.useViewerData();
  return viewerData?.id;
}

/**
 * Add event listeners for mouse movements, and transmit our cursor's position
 * via the presence API.
 */
function useSendCursor(
  baseLocation: Location,
  eventToLocation: LiveCursorsEventToLocationFn,
  organizationID: string | undefined,
): void {
  const { sdk } = useCordContext('LiveCursors.useSendCursor');
  const presenceSDK = sdk?.presence;

  // The result of eventToLocation from our own most recent mouse move, or null
  // if we haven't moved our mouse or have moved it outside of the page.
  const mouseLocationRef = useRef<Location | null>(null);

  const clearPresence = useCallback(() => {
    if (lastLocationRef.current && presenceSDK) {
      void presenceSDK.setPresent(
        {
          // We put baseLocation second so in case the same key is available in
          // both, the value from baseLocation is used, so that the overall
          // matching will work.
          ...lastLocationRef.current,
          ...baseLocation,
        },
        {
          exclusive_within: baseLocation,
          absent: true,
          organizationID,
          ...cordInternal,
        },
      );
    }
  }, [presenceSDK, baseLocation, organizationID]);

  // Track our own mouse movements and write them into mouseLocationRef.
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      void (async () => {
        mouseLocationRef.current = await eventToLocation(e);
      })();
    };
    const onMouseOut = () => {
      mouseLocationRef.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('beforeunload', clearPresence);
    return () => {
      clearPresence();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('beforeunload', clearPresence);
    };
  }, [eventToLocation, clearPresence]);

  // The last mouseLocationRef that we transmitted. Track this so that we don't
  // send unnecessary presence updates if our cursor hasn't actually moved.
  const lastLocationRef = useRef<Location | undefined>(undefined);

  useEffect(() => {
    const timer = setInterval(() => {
      // If the we are currently on the page...
      if (mouseLocationRef.current && presenceSDK) {
        // ...and our mouse has moved...
        if (
          !isEqualLocation(mouseLocationRef.current, lastLocationRef.current)
        ) {
          // ... send an update. See comment above the definition of
          // baseLocation in the main component describing the format of this
          // update.
          void presenceSDK.setPresent(
            {
              // We put baseLocation second so in case the same key is available
              // in both, the value from baseLocation is used, so that the
              // overall matching will work.
              ...mouseLocationRef.current,
              ...baseLocation,
            },
            { exclusive_within: baseLocation, organizationID, ...cordInternal },
          );
          lastLocationRef.current = mouseLocationRef.current;
        }
      } else if (lastLocationRef.current) {
        // If we aren't currently on the page, but we have an active mouse
        // position on the server, clear it.
        clearPresence();
        lastLocationRef.current = undefined;
      }
    }, POSITION_UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [presenceSDK, baseLocation, clearPresence, organizationID]);
}

/**
 * Subscribe to presence updates listening for other users' cursors, and return
 * a map from user ID to CursorState for other users' cursors currently on the
 * page.
 */
function useUserCursors(
  baseLocation: Location,
  locationToDocument: LiveCursorsLocationToDocumentFn,
  showViewerCursor: boolean,
  organizationID: string | undefined,
): Record<string, CursorPosition> {
  const { sdk } = useCordContext('LiveCursors.useUserCursors');
  const presenceSDK = sdk?.presence;

  const viewerID = useViewerID();

  const [userCursors, setUserCursors] = useState<
    Record<string, CursorPosition>
  >({});

  // Listen for and process cursor updates from other users.
  useEffect(() => {
    if (viewerID === undefined || !presenceSDK) {
      return undefined;
    }

    // Partial match listen for presence updates at baseLocation. See comment
    // above the definition of baseLocation in the main component for an
    // overview of how this works.
    const listenerRef = presenceSDK.observeLocationData(
      baseLocation,
      async (data) => {
        // Use locationToDocument to take the cursor positions encoded in the
        // locations the other users are present at, and turn those into
        // viewport coordinates.
        const mappedLocations: Record<
          string,
          Awaited<ReturnType<LiveCursorsLocationToDocumentFn>>
        > = {};
        await Promise.all(
          data.map(async ({ id, ephemeral }) => {
            const receivedLocation = ephemeral.locations[0];
            if ((showViewerCursor || id !== viewerID) && receivedLocation) {
              mappedLocations[id] = await locationToDocument(receivedLocation);
            } else {
              mappedLocations[id] = undefined;
            }
          }),
        );

        // Combine any updated viewport coordinates with the existing cursors.
        setUserCursors((prevUserCursors) => {
          const newUserCursors = { ...prevUserCursors };
          for (const id in mappedLocations) {
            const cursorLocation = mappedLocations[id];
            if (cursorLocation) {
              newUserCursors[id] = cursorLocation;
            } else {
              delete newUserCursors[id];
            }
          }
          return newUserCursors;
        });
      },
      {
        partial_match: true,
        exclude_durable: true,
        organizationID,
        ...cordInternal,
      },
    );

    return () => {
      presenceSDK.unobserveLocationData(listenerRef);
    };
  }, [
    locationToDocument,
    presenceSDK,
    baseLocation,
    viewerID,
    showViewerCursor,
    organizationID,
  ]);

  return userCursors;
}
