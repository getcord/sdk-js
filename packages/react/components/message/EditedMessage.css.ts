import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../../common/util.ts';
import { cssVar } from '../../common/ui/cssVariables.ts';

export const editedMessageTag = cordifyClassname('edited-message-tag');
globalStyle(`.${editedMessageTag}`, {
  marginTop: cssVar('space-2xs'),
  color: cssVar('color-content-secondary'),
});
