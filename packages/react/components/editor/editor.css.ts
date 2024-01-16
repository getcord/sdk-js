import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../../common/util';
import Sizes from '../../common/const/Sizes';
import { CODE_STYLE } from '../../common/lib/styles';

export const inlineCode = cordifyClassname('inline-code');
globalStyle(`.${inlineCode}`, {
  ...CODE_STYLE,
  padding: `0 ${Sizes.XSMALL}px`,
});
