import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../../util';
import { cssVar } from '@cord-sdk/react/common/ui/cssVariables';

export const iconSmall = cordifyClassname('icon-small');
globalStyle(`.${iconSmall}`, {
  height: cssVar('space-m'),
  width: cssVar('space-m'),
});

export const iconLarge = cordifyClassname('icon-large');
globalStyle(`.${iconLarge}`, {
  height: cssVar('space-l'),
  width: cssVar('space-l'),
});
