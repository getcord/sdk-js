import { globalStyle } from '../common/ui/style.js';
import { cordifyClassname } from '../common/util.js';

export const loadingIndicator = cordifyClassname('loading-indicator');

globalStyle(`.${loadingIndicator}`, {
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
});
