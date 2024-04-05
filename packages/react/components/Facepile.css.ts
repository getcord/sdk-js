import { globalStyle } from '../common/ui/style.js';
import { cssVar } from '../common/ui/cssVariables.js';
import { getModifiedSelector } from '../common/ui/modifiers.js';
import { cordifyClassname } from '../common/util.js';
import * as classes from './Facepile.classnames.js';
import { typing } from './Thread.classnames.js';
import { emptyStatePlaceholderContainer } from './helpers/EmptyStateWithFacepile.classnames.js';
export default classes;

const { facepileContainer, otherUsers, otherUsersPlaceholder } = classes;

/**
 * Base styles
 */
globalStyle(`.${facepileContainer}`, {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  isolation: 'isolate',
  position: 'relative',
});

globalStyle(`.${otherUsers}`, {
  alignItems: 'center',
  alignSelf: 'stretch',
  color: cssVar('color-content-primary'),
  cursor: 'default',
  display: 'flex',
  paddingLeft: cssVar('facepile-avatar-border-width'),
});
globalStyle(`:where(.${otherUsers}):hover`, {
  color: cssVar('color-content-emphasis'),
});

/**
 * Facepile styles when used in other components
 */
globalStyle(`:where(.${facepileContainer}) .${otherUsersPlaceholder}`, {
  backgroundColor: cssVar('color-content-emphasis'),
  borderRadius: cssVar('avatar-border-radius'),
  color: cssVar('color-base'),
  display: 'flex',
  justifyContent: 'center',
  marginLeft: `calc(${cssVar('facepile-avatar-border-width')} * -1)`,
});
globalStyle(
  `:where(.${cordifyClassname(
    'collapsed-thread-footer',
  )}) .${otherUsersPlaceholder}`,
  {
    height: cssVar('space-m'),
    width: cssVar('space-m'),
  },
);

globalStyle(getModifiedSelector('extraLarge', `.${otherUsersPlaceholder}`), {
  width: cssVar('space-xl'),
});
globalStyle(getModifiedSelector('large', `.${otherUsersPlaceholder}`), {
  width: cssVar('space-l'),
});
globalStyle(getModifiedSelector('medium', `.${otherUsersPlaceholder}`), {
  width: cssVar('space-m'),
});

globalStyle(
  `:where(.${emptyStatePlaceholderContainer}) .${facepileContainer}`,
  {
    marginBottom: cssVar('space-m'),
  },
);

globalStyle(`:where(.${typing}) .${facepileContainer}`, {
  minWidth: '20px',
});
