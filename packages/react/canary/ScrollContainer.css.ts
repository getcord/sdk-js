import { cssVar } from '../common/ui/cssVariables.js';
import { globalStyle } from '../common/ui/style.js';
import { cordifyClassname } from '../common/util.js';
import { thread } from '../components/Thread.classnames.js';

export const scrollContainer = cordifyClassname('scroll-container');
globalStyle(`.${scrollContainer}`, {
  position: 'relative',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  flexShrink: 1,
});

globalStyle(`:where(.${thread}) .${scrollContainer}`, {
  gap: cssVar('space-2xs'),
  padding: cssVar('space-3xs'),
  paddingBottom: cssVar('space-2xs'),
});
