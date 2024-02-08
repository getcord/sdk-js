import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '../common/ui/cssVariables.ts';
import { menu } from './Menu.css.ts';
import * as classes from './helpers/Separator.classnames.ts';

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
