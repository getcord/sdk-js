import * as React from 'react';
import type {
  ClientUserData,
  LiveCursorsCursorPosition,
} from '@cord-sdk/types';
import * as classes from './LiveCursors.css';
import { Icon } from './helpers/Icon';

type CursorPosition = NonNullable<LiveCursorsCursorPosition>;

export type LiveCursorsCursorProps = {
  /**
   * User controlling this cursor.
   */
  user: ClientUserData;

  /**
   * The position of the user's cursor in viewport-relative coordinates.
   */
  pos: CursorPosition;
};

// The set of colors we rotate between as we need colors for people.
const CURSOR_COLORS = ['#9A6AFF', '#EB5757', '#71BC8F', '#F88D76'];

// Index of the next CURSOR_COLORS to use when we see a new user.
let colorIndex = 0;

// Saved colors of users (map from user ID to their color). We never delete from
// this map so that a user's color is always consistent across a page load even
// if their cursor goes away and comes back later.
const colors: Record<string, string> = {};

function getColor(userID: string) {
  return (colors[userID] ??=
    CURSOR_COLORS[colorIndex++ % CURSOR_COLORS.length]);
}

export function LiveCursorsDefaultCursor({
  user,
  pos,
}: LiveCursorsCursorProps) {
  const color = React.useMemo(() => getColor(user.id), [user.id]);

  return (
    <div
      className={classes.cursor}
      style={{
        left: pos.x + 'px',
        top: pos.y + 'px',
        [classes.colorVar as any]: color,
      }}
    >
      <Icon className={classes.icon} name="Cursor" size="large" />
      <span className={classes.name}>{user.name}</span>
    </div>
  );
}
