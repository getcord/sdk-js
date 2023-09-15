import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type MultipleCursorsEventToLocationFn,
  type MultipleCursorsLocationToDocumentFn,
  type Location,
  isEqualLocation,
} from '@cord-sdk/types';

import { useCordLocation } from '../hooks/useCordLocation';
import { user } from '..';
import { useCordContext } from '../contexts/CordContext';
import * as classes from './MultipleCursors.css';
import { POSITION_UPDATE_INTERVAL_MS } from './MultipleCursors.css';
import { Icon } from './helpers/Icon';

export type MultipleCursorsReactComponentProps = {
  location?: Location;
  showViewerCursor?: boolean;
  translations?: {
    eventToLocation: MultipleCursorsEventToLocationFn;
    locationToDocument: MultipleCursorsLocationToDocumentFn;
  };
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
export async function defaultLocationToDocument(location: Location) {
  const annotationSDK = window.CordSDK?.annotation;
  if ('__cord_annotation' in location && annotationSDK) {
    const coords = await annotationSDK.stringToViewportCoordinates(
      String(location.__cord_annotation),
    );
    if (coords) {
      return {
        documentX: coords.x,
        documentY: coords.y,
      };
    }
  }

  if ('__cord_cursor_x' in location && '__cord_cursor_y' in location) {
    return {
      documentX: location.__cord_cursor_x as number,
      documentY: location.__cord_cursor_y as number,
    };
  }

  return null;
}

type CursorPosition = {
  documentX: number;
  documentY: number;
};

/**
 * The position and color of a specific user's cursor. We allow `pos` to become
 * `undefined` so that we can still track the color of a cursor which currently
 * isn't visible, to keep a user's color consistent (at least for a single
 * page load).
 */
type CursorState = {
  pos: CursorPosition | undefined;
  color: string;
};

// The set of colors we rotate between as we need colors for people.
const CURSOR_COLORS = ['#9A6AFF', '#EB5757', '#71BC8F', '#F88D76'];

// A secret param passed to a few API functions which only affects Cord's
// logging. Feel free to remove this if you're modifying this code in your own
// app.
const cordInternal: any = {
  __cordInternal: true,
};

export function MultipleCursors({
  location: locationProp,
  showViewerCursor,
  translations,
  ...remainingProps
}: MultipleCursorsReactComponentProps) {
  // Make sure we've covered all the props we say we take; given the layers of
  // type generics etc it's easy to forget something.
  const _: Record<string, never> = remainingProps;

  const contextLocation = useCordLocation();
  const locationInput = locationProp ?? contextLocation;
  if (!locationInput) {
    throw new Error('cord-multiple-cursors: missing location');
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
      __cord_multiple_cursors: true,
    }),
    [locationInput],
  );

  useSendCursor(baseLocation, eventToLocation);

  const userCursors = useUserCursors(
    baseLocation,
    locationToDocument,
    !!showViewerCursor,
  );

  // Load detailed information for each user whose cursor we have, so we can
  // display their name etc.
  const users = user.useUserData(Object.keys(userCursors));
  const viewerID = useViewerID();

  // Combine the userCursors user ID and position info with the detailed user
  // information to produce the information Cursor needs to actually render.
  const result = useMemo<CursorProps[]>(() => {
    if (viewerID === undefined) {
      // Skip if we don't know who the viewer is, since we don't want to show
      // them their own cursor.
      return [];
    }

    return Object.keys(userCursors)
      .filter((id) => userCursors[id].pos && users[id])
      .map((id) => ({
        id,
        name: users[id]!.shortName ?? users[id]!.name ?? 'Unknown',
        pos: userCursors[id].pos!,
        color: userCursors[id].color,
      }));
  }, [users, userCursors, viewerID]);

  return (
    <>
      {result.map((props) => (
        <Cursor key={props.id} {...props} />
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
  eventToLocation: MultipleCursorsEventToLocationFn,
): void {
  const { sdk } = useCordContext('MultipleCursors.useSendCursor');
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
          ...cordInternal,
        },
      );
    }
  }, [presenceSDK, baseLocation]);

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
            { exclusive_within: baseLocation, ...cordInternal },
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
  }, [presenceSDK, baseLocation, clearPresence]);
}

/**
 * Subscribe to presence updates listening for other users' cursors, and return
 * a map from user ID to CursorState for other users' cursors currently on the
 * page.
 */
function useUserCursors(
  baseLocation: Location,
  locationToDocument: MultipleCursorsLocationToDocumentFn,
  showViewerCursor: boolean,
): Record<string, CursorState> {
  const { sdk } = useCordContext('MultipleCursors.useUserCursors');
  const presenceSDK = sdk?.presence;

  const viewerID = useViewerID();

  const [userCursors, setUserCursors] = useState<Record<string, CursorState>>(
    {},
  );

  // Index of the next CURSOR_COLORS to use when we see a new user.
  const colorIndex = useRef<number>(0);

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
          Awaited<ReturnType<MultipleCursorsLocationToDocumentFn>>
        > = {};
        await Promise.all(
          data.map(async ({ id, ephemeral }) => {
            const receivedLocation = ephemeral.locations[0];
            if ((showViewerCursor || id !== viewerID) && receivedLocation) {
              mappedLocations[id] = await locationToDocument(receivedLocation);
            }
          }),
        );

        // Combine any updated viewport coordinates with the existing cursors.
        setUserCursors((prevUserCursors) => {
          const newUserCursors = { ...prevUserCursors };
          for (const { id } of data) {
            // We specifically use || because it short circuits, so it only
            // advances the colorIndex if it uses it.
            const existingValue = prevUserCursors[id] || {
              pos: undefined,
              color: CURSOR_COLORS[colorIndex.current++ % CURSOR_COLORS.length],
            };

            const cursorLocation = mappedLocations[id] ?? undefined;
            newUserCursors[id] = {
              ...existingValue,
              pos: cursorLocation,
            };
          }
          return newUserCursors;
        });
      },
      { partial_match: true, exclude_durable: true, ...cordInternal },
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
  ]);

  return userCursors;
}

type CursorProps = {
  id: string;
  name: string;
  pos: CursorPosition;
  color: string;
};

/**
 * Component for an individual cursor. A "dumb" rendering component, taking only
 * the processed data it needs to render and just dumping that onto the screen.
 * All of the smarts are above.
 */
function Cursor({ name, pos, color }: CursorProps) {
  return (
    <div
      className={classes.cursor}
      style={{ left: pos.documentX + 'px', top: pos.documentY + 'px' }}
    >
      <Icon name="Cursor" size="large" style={{ color: color }} />
      <span className={classes.name} style={{ backgroundColor: color }}>
        {name}
      </span>
    </div>
  );
}
