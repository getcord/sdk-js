import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '@cord-sdk/react/common/ui/cssVariables.ts';
import { menu } from '@cord-sdk/react/components/Menu.css.ts';
import * as classes from '@cord-sdk/react/components/helpers/Separator.classnames.ts';
export default classes;

const { separator } = classes;

globalStyle(`.${separator}`, {
  backgroundColor: cssVar('color-base-x-strong'),
  flex: 'none',
  height: `calc(${cssVar('space-4xs')}/2)`,
  marginBlock: cssVar('space-2xs'),
});

/** Styles when used in other components  */
globalStyle(`.${menu} > :where(.${separator})`, {
  marginBlock: cssVar('space-3xs'),
});
