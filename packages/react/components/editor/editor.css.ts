import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../../common/util.ts';
import { Sizes } from '../../common/const/Sizes.ts';
import { CODE_STYLE } from '../../common/lib/styles.ts';

export const inlineCode = cordifyClassname('inline-code');
globalStyle(`.${inlineCode}`, {
  ...CODE_STYLE,
  padding: `0 ${Sizes.XSMALL}px`,
});
