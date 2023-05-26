import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';

export const dummy = cordifyClassname('dummy');
globalStyle(`.${dummy}`, {
  display: 'block',
  height: '100px',
  width: '100px',
  backgroundColor: 'red',
});
