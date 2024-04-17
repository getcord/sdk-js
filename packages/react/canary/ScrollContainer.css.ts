import { globalStyle } from '../common/ui/style.js';
import { cordifyClassname } from '../common/util.js';

export const scrollContainer = cordifyClassname('scroll-container');
globalStyle(`.${scrollContainer}`, {
  position: 'relative',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  maxHeight: '400px',
});
