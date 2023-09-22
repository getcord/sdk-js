import * as React from 'react';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqualLocation } from '@cord-sdk/types';
import type {
  LiveCursorsEventToLocationFn,
  LiveCursorsLocationToDocumentFn,
  Location,
  LiveCursorsCursorPosition,
} from '@cord-sdk/types';
import { debounce } from 'radash';

import { useCordLocation } from '../hooks/useCordLocation';
import * as user from '../hooks/user';
import { useCordContext } from '../contexts/CordContext';
import { POSITION_UPDATE_INTERVAL_MS } from './LiveCursors.css';
import { LiveCursorsDefaultCursor } from './LiveCursorsDefaultCursor';
import type { LiveCursorsCursorProps } from './LiveCursorsDefaultCursor';

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
        viewportX: coords.x,
        viewportY: coords.y,
      };
    }
  }

  if ('__cord_cursor_x' in location && '__cord_cursor_y' in location) {
    return {
      viewportX: (location.__cord_cursor_x as number) - window.scrollX,
      viewportY: (location.__cord_cursor_y as number) - window.scrollY,
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

  // Cord presence gives us a Location for the cursor, which is a durable
  // semantic encoding. We then convert that into a CursorPosition, which is
  // viewport-relative x/y coordinates. Those viewport coordinates change as
  // they scroll, so we need to track the original Location for each cursor and
  // recompute both when we get any updates and when the page is scrolled.
  // Unfortunately that conversion process is async, so it needs to happen in
  // the event handlers (we can't just have one state to store the Location and
  // convert as we return). Instead, use a ref to track the Location (we don't
  // need to rerender when it changes, just need a persistent place to hold onto
  // it), and then have a helper function which does the conversion into another
  // state which is the actual CursorPosition we can return. (We immediately
  // call that conversion helper after changes to the Locations.)
  const cursorLocations = useRef<Record<string, Location>>({});
  const [cursorPositions, setCursorPositions] = useState<
    Record<string, CursorPosition>
  >({});

  // Aforementioned conversion function, see above.
  const computeCursorPositions = useCallback(async () => {
    const newCursorPositions: Record<string, CursorPosition> = {};
    await Promise.all(
      Object.entries(cursorLocations.current).map(async ([id, location]) => {
        const pos = await locationToDocument(location);
        if (pos) {
          newCursorPositions[id] = pos;
        }
      }),
    );

    setCursorPositions(newCursorPositions);
  }, [locationToDocument]);
  const debouncedComputeCursorPositions = useMemo(
    () => debounce({ delay: 50 }, computeCursorPositions),
    [computeCursorPositions],
  );

  // Listen for and process cursor updates from other users.
  useEffect(() => {
    if (viewerID === undefined || !presenceSDK) {
      return undefined;
    }

    // Partial match listen for presence updates at baseLocation. See comment
    // above the definition of baseLocation in the main component for an
    // overview of how this works.
    const locationDataListenerRef = presenceSDK.observeLocationData(
      baseLocation,
      async (data) => {
        data.forEach(({ id, ephemeral }) => {
          const receivedLocation = ephemeral.locations[0];
          if ((showViewerCursor || id !== viewerID) && receivedLocation) {
            cursorLocations.current[id] = receivedLocation;
          } else {
            delete cursorLocations.current[id];
          }
        });
        debouncedComputeCursorPositions();
      },
      {
        partial_match: true,
        exclude_durable: true,
        organizationID,
        ...cordInternal,
      },
    );

    return () => {
      presenceSDK.unobserveLocationData(locationDataListenerRef);
    };
  }, [
    locationToDocument,
    presenceSDK,
    baseLocation,
    viewerID,
    showViewerCursor,
    organizationID,
    debouncedComputeCursorPositions,
  ]);

  // Also recompute positions on scroll, since the coordinates are
  // viewport-relative.
  useEffect(() => {
    document.addEventListener('scroll', debouncedComputeCursorPositions);
    document.addEventListener('wheel', debouncedComputeCursorPositions);
    document.addEventListener('resize', debouncedComputeCursorPositions);
    return () => {
      document.removeEventListener('scroll', debouncedComputeCursorPositions);
      document.removeEventListener('wheel', debouncedComputeCursorPositions);
      document.removeEventListener('resize', debouncedComputeCursorPositions);
    };
  }, [debouncedComputeCursorPositions]);

  return cursorPositions;
}
