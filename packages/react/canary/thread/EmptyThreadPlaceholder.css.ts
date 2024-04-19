import { globalStyle } from '../../common/ui/style.js';
import { cssVar } from '../../common/ui/cssVariables.js';
import {
  emptyThreadPlaceholderContainer,
  emptyThreadPlaceholderTitle,
  emptyThreadPlaceholderBody,
} from './EmptyThreadPlaceholder.classnames.js';
export * from './EmptyThreadPlaceholder.classnames.js';

globalStyle(`.${emptyThreadPlaceholderContainer}`, {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-body'),
  lineHeight: cssVar('line-height-body'),
  margin: 'auto 0',
  overflow: 'auto',
  padding: cssVar('space-xs'),
  paddingBottom: cssVar('space-m'),
});

globalStyle(
  `.${emptyThreadPlaceholderContainer} :where(.${emptyThreadPlaceholderTitle})`,
  {
    color: cssVar('color-content-emphasis'),
    margin: `${cssVar('space-m')} 0 ${cssVar('space-2xs')} 0`,
    fontWeight: cssVar('font-weight-bold'),
  },
);

globalStyle(
  `.${emptyThreadPlaceholderContainer} :where(.${emptyThreadPlaceholderBody})`,
  {
    color: cssVar('color-content-primary'),
    fontWeight: cssVar('font-weight-regular'),
  },
);
