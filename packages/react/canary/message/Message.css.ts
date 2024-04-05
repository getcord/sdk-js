import { cssVar } from '../../common/ui/cssVariables.js';
import { MODIFIERS, getModifiedSelector } from '../../common/ui/modifiers.js';
import {
  CORD_COMPONENT_BASE_CLASS,
  CORD_V2,
  defaultGlobalStyle,
  globalStyle,
} from '../../common/ui/style.js';
import * as classes from '../../components/Message.classnames.js';
export * from '../../components/Message.classnames.js';

const {
  authorName,
  deletedIcon,
  deletedMessageText,
  message,
  optionsMenuTrigger,
  sentViaIcon,
  undoDeleteButton,
  messageOptionsButtons,
} = classes;

const BULLET_CHARACTER = '\\2022';

defaultGlobalStyle(
  `:where(.${CORD_COMPONENT_BASE_CLASS}.${CORD_V2}).${message}`,
  {
    backgroundColor: cssVar('color-base'),
    borderRadius: cssVar('border-radius-medium'),
    position: 'relative',
    padding: `${cssVar('space-3xs')} ${cssVar('space-3xs')} ${cssVar(
      'space-2xs',
    )} ${cssVar('space-2xs')} `,
    display: 'grid',
    gridTemplateColumns: `20px auto auto auto 1fr auto`,
    gridTemplateRows: `24px auto auto`,
    gridGap: `${cssVar('space-3xs')} ${cssVar('space-2xs')}`,
    alignItems: 'center',
    gridTemplateAreas: `
    "avatar authorName timestamp sentViaIcon . optionsMenu"
    ". messageContent messageContent messageContent messageContent optionsMenu"
    ". reactions reactions reactions reactions ."`,
  },
);

globalStyle(getModifiedSelector('noReactions', `.${message}`), {
  gridTemplateRows: '24px auto',
  gridTemplateAreas: `
    "avatar authorName timestamp sentViaIcon . optionsMenu"
    ". messageContent messageContent messageContent messageContent optionsMenu"`,
});

defaultGlobalStyle(
  getModifiedSelector(
    'resolved',
    ` :where(.${CORD_COMPONENT_BASE_CLASS}.${CORD_V2}).${message}`,
  ),
  {
    backgroundColor: 'inherit',
  },
);

defaultGlobalStyle(
  getModifiedSelector(
    'highlighted',
    ` :where(.${CORD_COMPONENT_BASE_CLASS}.${CORD_V2}).${message}`,
  ),
  {
    backgroundColor: 'inherit',
  },
);

const actionMessage = {
  color: cssVar('color-content-primary'),
  gridTemplateRows: '24px',
  gridTemplateColumns: '20px auto 1fr',
  gridTemplateAreas: `"icon message"`,
};
globalStyle(
  `.${message}:where(.${MODIFIERS.action}, .${MODIFIERS.deleted})`,
  actionMessage,
);
globalStyle(
  getModifiedSelector(
    'editing',
    `:where(.${CORD_COMPONENT_BASE_CLASS}.${CORD_V2}).${message}`,
  ),
  {
    gridTemplateRows: 'auto',
    gridTemplateColumns: '20px auto',
    gridTemplateAreas: `"avatar messageContent"`,
    alignItems: 'start',
  },
);

globalStyle(`.${authorName}`, {
  alignSelf: 'baseline',
  color: cssVar('color-content-emphasis'),
  gridArea: 'authorName',
  marginTop: cssVar('space-3xs'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

globalStyle(`.${sentViaIcon}`, {
  alignSelf: 'stretch',
  marginLeft: `calc(-1 * ${cssVar('space-3xs')})`,
  marginRight: `calc(-1 * ${cssVar('space-3xs')})`,
  marginTop: cssVar('space-3xs'),
  color: cssVar('color-content-secondary'),
  gridArea: 'sentViaIcon',
  display: 'flex',
  alignItems: 'center',
});

globalStyle(`.${optionsMenuTrigger}`, {
  display: 'flex',
  gridArea: 'optionsMenu',
  alignSelf: 'flex-start',
});

globalStyle(`.${undoDeleteButton}`, {
  color: cssVar('color-content-emphasis'),
  cursor: 'pointer',
  display: 'inline-block',
});
defaultGlobalStyle(
  `:where(.${CORD_COMPONENT_BASE_CLASS}.${CORD_V2}) .${undoDeleteButton}::before`,
  {
    content: BULLET_CHARACTER,
    color: cssVar('color-content-primary'),
    margin: `0 ${cssVar('space-3xs')}`,
  },
);

globalStyle(`.${deletedMessageText}`, {
  textOverflow: 'ellipsis',
  gridArea: 'message',
});
globalStyle(`:where(cord-thread) .${deletedMessageText}`, {
  gridArea: 'auto',
});

globalStyle(`.${deletedIcon}`, {
  gridArea: 'icon',
});

globalStyle(`.${messageOptionsButtons}`, {
  display: 'flex',
  gap: cssVar('space-3xs'),
  background: 'transparent',
  borderRadius: cssVar('space-3xs'),
  paddingTop: cssVar('space-3xs'),
});
globalStyle(`:where(.${message}) .${messageOptionsButtons}`, {
  paddingTop: '0px',
  flexDirection: 'column',
  pointerEvents: 'none',
  visibility: 'hidden',
});
globalStyle(`:where(.${message}):hover .${messageOptionsButtons}`, {
  visibility: 'visible',
  pointerEvents: 'auto',
});

globalStyle(`.${message} :where(.${messageOptionsButtons}.${MODIFIERS.open})`, {
  // Never hide the menu and its contents if the popper is open.
  visibility: 'visible',
});
