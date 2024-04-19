import {
  CORD_V2,
  defaultGlobalStyle,
  globalStyle,
} from '../../common/ui/style.js';
import { Colors } from '../../common/const/Colors.js';
import { cssVar } from '../../common/ui/cssVariables.js';
import { getModifiedSelector } from '../../common/ui/modifiers.js';

import * as classes from '../../components/Composer.classnames.js';
import { editorStyles } from '../../common/lib/editor/styles.js';
import { editableStyle } from './lib/util.js';
export default classes;

const { composerContainer, composerErrorMessage, editor } = classes;

defaultGlobalStyle(`:where(.${CORD_V2}).${composerContainer}`, {
  backgroundColor: cssVar('color-base'),
  border: cssVar('composer-border'),
  borderRadius: cssVar('composer-border-radius'),
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  gap: cssVar('space-2xs'),
  paddingBottom: cssVar('space-2xs'),
  paddingTop: cssVar('space-2xs'),
  // A flex/grid item min size is auto,
  // but we need the composer to be able to shrink smaller than its content.
  // This avoids the composer becoming giant and overflowing,
  // for instance when user uploads a file with very long filename.
  minWidth: 0,
});

globalStyle(
  getModifiedSelector('disabled', `.${composerContainer}:where(.${CORD_V2})`),
  {
    backgroundColor: cssVar('color-base-strong'),
  },
);

globalStyle(`.${composerErrorMessage}`, {
  margin: 'auto',
  color: Colors.ALERT,
  fontSize: '12px',
});

defaultGlobalStyle(`:where(.${CORD_V2}).${composerContainer}:focus-within`, {
  border: cssVar('composer-border--focus'),
  boxShadow: cssVar('shadow-focus'),
});

globalStyle(`.${composerContainer} .${editor}`, {
  ...editorStyles,
  ...editableStyle,
  paddingRight: cssVar('space-s'),
  paddingLeft: cssVar('space-s'),
  paddingBottom: cssVar('space-m'),
  outline: 'none',
  flexGrow: 1,
  overflow: 'hidden auto',
});
