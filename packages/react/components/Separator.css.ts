import { globalStyle } from '../common/ui/style.js';
import { cssVar } from '../common/ui/cssVariables.js';
import { menu } from './Menu.css.js';
import * as classes from './helpers/Separator.classnames.js';

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
