import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { cssVar } from '../common/ui/cssVariables';
import * as avatarClasses from './Avatar.classnames';
import { ZINDEX } from '@cord-sdk/react/common/ui/zIndex';

export const POSITION_UPDATE_INTERVAL_MS = 100;

export const cursor = cordifyClassname('live-cursors-cursor');
export const icon = cordifyClassname('live-cursors-icon');
export const label = cordifyClassname('live-cursors-label');
export const name = cordifyClassname('live-cursors-name');

export const colorVar = '--cord-live-cursors-cursor-color';
export const borderVar = '--cord-live-cursors-cursor-border-color';

globalStyle(`.${cursor}`, {
  // A small negative margin makes the pointer of the icon appear where the
  // other user's cursor actually is
  marginLeft: -2,
  marginTop: -2,
  padding: 0,
  position: 'fixed',
  zIndex: ZINDEX.annotation,
  transition: `all ${POSITION_UPDATE_INTERVAL_MS}ms linear`,
});

globalStyle(`.${icon}`, {
  color: `var(${colorVar})`,
});

// Unfortunately 0-2-0 specificity -- Avatar isn't OSS so this style should live
// here, and so there's no way to get a 0-1-0 here to consistently override it's
// 0-1-0.
globalStyle(`.${label} .${avatarClasses.avatarContainer}`, {
  height: cssVar('space-xl'),
  width: cssVar('space-xl'),
  borderRadius: cssVar('space-xl'),

  // Negative margin to pull the avatar a little more towards the left since
  // it's rounded, but to let the label still look good/centered if there is no
  // avatar.
  marginLeft: '-6px',
});

globalStyle(`.${label}`, {
  border: `1px solid var(${borderVar})`,
  borderRadius: '100px',
  color: 'white',
  padding: '4px 12px',
  position: 'absolute',
  top: '11px',
  left: '10px',
  whiteSpace: 'nowrap',
  backgroundColor: `var(${colorVar})`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});
