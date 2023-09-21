import * as React from 'react';
import type {
  ClientUserData,
  LiveCursorsCursorPosition,
} from '@cord-sdk/types';
import * as classes from './LiveCursors.css';
import { Icon } from './helpers/Icon';
import { Avatar } from './Avatar';

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
const CURSOR_COLORS = [
  { background: '#0079FF', border: '#074B9C' },
  { background: '#9A6AFF', border: '#6949AC' },
  { background: '#9B3617', border: '#4E1908' },
  { background: '#45CF7C', border: '#159347' },
];

// Index of the next CURSOR_COLORS to use when we see a new user.
let colorIndex = 0;

// Saved colors of users (map from user ID to their color). We never delete from
// this map so that a user's color is always consistent across a page load even
// if their cursor goes away and comes back later.
const colors: Record<string, (typeof CURSOR_COLORS)[number]> = {};

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
        [classes.colorVar as any]: color.background,
        [classes.borderVar as any]: color.border,
      }}
    >
      <Icon className={classes.icon} name="Cursor" size="large" />
      <div className={classes.label}>
        {user.profilePictureURL && <Avatar userId={user.id} />}
        <span className={classes.name}>{user.name}</span>
      </div>
    </div>
  );
}
