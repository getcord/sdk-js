import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { ZINDEX } from '@cord-sdk/react/common/ui/zIndex';

export const POSITION_UPDATE_INTERVAL_MS = 100;

export const cursor = cordifyClassname('multiple-cursors-cursor');
export const name = cordifyClassname('multiple-cursors-name');

globalStyle(`.${cursor}`, {
  // A small negative margin makes the pointer of the icon appear where the
  // other user's cursor actually is
  marginLeft: -2,
  marginTop: -2,
  padding: 0,
  position: 'absolute',
  zIndex: ZINDEX.annotation,
  transition: `all ${POSITION_UPDATE_INTERVAL_MS}ms linear`,
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
});
