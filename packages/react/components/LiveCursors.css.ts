import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { ZINDEX } from '@cord-sdk/react/common/ui/zIndex';

export const POSITION_UPDATE_INTERVAL_MS = 100;

export const cursor = cordifyClassname('live-cursors-cursor');
export const icon = cordifyClassname('live-cursors-icon');
export const name = cordifyClassname('live-cursors-name');

export const colorVar = '--cord-live-cursors-cursor-color';

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

globalStyle(`.${name}`, {
  borderRadius: '100px',
  color: 'white',
  left: '10px',
  paddingBottom: 2,
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 2,
  position: 'absolute',
  top: '11px',
  whiteSpace: 'nowrap',
  backgroundColor: `var(${colorVar})`,
});
