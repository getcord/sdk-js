import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../../common/util.js';
import { Sizes } from '../../common/const/Sizes.js';
import { CODE_STYLE } from '../../common/lib/styles.js';

export const inlineCode = cordifyClassname('inline-code');
globalStyle(`.${inlineCode}`, {
  ...CODE_STYLE,
  padding: `0 ${Sizes.XSMALL}px`,
});
