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

type CursorState = {
  pos: CursorPosition | undefined;
  color: string;
};

// The set of colors we rotate between as we need colors for people
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
  const location = locationProp ?? contextLocation;
  if (!location) {
    throw new Error('cord-multiple-cursors: missing location');
  }

  const eventToLocation =
    translations?.eventToLocation ?? defaultEventToLocation;
  const locationToDocument =
    translations?.locationToDocument ?? defaultLocationToDocument;

  const mouseLocationRef = useRef<Location | null>(null);

  const { sdk } = useCordContext('MultipleCursors');
  const presenceSDK = sdk?.presence;

  const region = useMemo(
    () => ({
      ...location,
      __cord_multiple_cursors: true,
    }),
    [location],
  );

  const clearPresence = useCallback(() => {
    if (lastLocationRef.current && presenceSDK) {
      void presenceSDK.setPresent(
        {
          // NOTE(flooey): We put region second so in case the same key is
          // available in both, the value from region is used, so that
          // the overall matching will work.
          ...lastLocationRef.current,
          ...region,
        },
        {
          exclusive_within: region,
          absent: true,
          ...cordInternal,
        },
      );
    }
  }, [presenceSDK, region]);

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

  const lastLocationRef = useRef<Location | undefined>(undefined);
  useEffect(() => {
    const timer = setInterval(() => {
      if (mouseLocationRef.current && presenceSDK) {
        // If the user is currently on the page...
        if (
          !isEqualLocation(mouseLocationRef.current, lastLocationRef.current)
        ) {
          // ...and their mouse has moved, send an update
          void presenceSDK.setPresent(
            {
              // NOTE(flooey): We put region second so in case the same key is
              // available in both, the value from region is used, so that
              // the overall matching will work.
              ...mouseLocationRef.current,
              ...region,
            },
            { exclusive_within: region, ...cordInternal },
          );
          lastLocationRef.current = mouseLocationRef.current;
        }
      } else if (lastLocationRef.current) {
        // If the user isn't here, but we have an active mouse position on the
        // server, clear it
        clearPresence();
        lastLocationRef.current = undefined;
      }
    }, POSITION_UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [presenceSDK, region, clearPresence]);

  const viewerData = user.useViewerData();
  const viewerID = viewerData?.id;

  const [userCursors, setUserCursors] = useState<Record<string, CursorState>>(
    {},
  );

  const users = user.useUserData(Object.keys(userCursors));

  // This is the index of the next color to use when we see a new user
  const colorIndex = useRef<number>(0);
  useEffect(() => {
    if (viewerID === undefined || !presenceSDK) {
      return undefined;
    }
    const listenerRef = presenceSDK.observeLocationData(
      region,
      async (data) => {
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

        setUserCursors((prevUserCursors) => {
          const newUserCursors = { ...prevUserCursors };
          for (const { id } of data) {
            // We specifically use || because it short circuits, so it only
            // advances the colorIndex if it uses it
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
  }, [locationToDocument, presenceSDK, region, viewerID, showViewerCursor]);

  const result = useMemo<CursorProps[]>(() => {
    if (viewerID === undefined) {
      // Skip if we don't know who the viewer is, since we don't want to show
      // them their own cursor
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

type CursorProps = {
  id: string;
  name: string;
  pos: CursorPosition;
  color: string;
};

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
