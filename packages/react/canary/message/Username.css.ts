import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '../../common/ui/cssVariables.js';
import { authorName } from '../../components/Message.classnames.js';

globalStyle(`.${authorName}`, {
  alignSelf: 'baseline',
  color: cssVar('color-content-emphasis'),
  gridArea: 'authorName',
  marginTop: cssVar('space-3xs'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
