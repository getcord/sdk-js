import { globalStyle } from '@vanilla-extract/css';

import { cssVar } from '../../common/ui/cssVariables.ts';
import {
  composerContainer,
  attachmentsContainer,
} from '../Composer.classnames.ts';

export default { attachmentsContainer };

globalStyle(`:where(.${composerContainer}) .${attachmentsContainer}`, {
  display: 'flex',
  flexWrap: 'wrap',
  gap: cssVar('space-2xs'),
  marginInline: cssVar('space-2xs'),
  alignItems: 'start',
});
