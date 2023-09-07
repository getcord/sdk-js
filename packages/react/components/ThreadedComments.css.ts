import type { CSSProperties } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { cssVar } from '../common/ui/cssVariables';
import { getModifiedSelector, MODIFIERS } from '../common/ui/modifiers';
import * as classes from './ThreadedComments.classnames';
export default classes;

const {
  comments,
  tabContainer,
  tab,
  threadList,
  thread,
  resolvedThreadHeader,
  reopenButton,
  expandReplies,
  repliesContainer,
  hideReplies,
  showMore,
  viewerAvatarWithComposer,
} = classes;

globalStyle(`.${comments}`, {
  width: '320px',
  border: `1px solid ${cssVar('color-base-x-strong')}`,
  padding: cssVar('space-2xs'),
  borderRadius: cssVar('space-3xs'),
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
  backgroundColor: cssVar('color-base'),
});

globalStyle(`.${threadList}`, {
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
  height: 'auto',
});

globalStyle(`.${thread}`, {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: cssVar('space-3xs'),
});

globalStyle(`.${resolvedThreadHeader}`, {
  alignItems: 'center',
  color: cssVar('color-content-primary'),
  display: 'flex',
  gap: cssVar('space-2xs'),
  padding: `0 ${cssVar('space-3xs')} 0 ${cssVar('space-2xs')}`,
});

globalStyle(`.${reopenButton}`, {
  border: 'none',
  borderRadius: cssVar('space-3xs'),
  cursor: 'pointer',
  marginLeft: 'auto',
  padding: `${cssVar('space-3xs')} ${cssVar('space-2xs')}`,
  pointerEvents: 'none',
  visibility: 'hidden',
});

globalStyle(`.${reopenButton}:hover`, {
  backgroundColor: cssVar('color-base-x-strong'),
});

globalStyle(`:where(.${resolvedThreadHeader}):hover .${reopenButton}`, {
  pointerEvents: 'auto',
  visibility: 'visible',
});

globalStyle(getModifiedSelector('resolved', `.${thread}`), {
  backgroundColor: cssVar('color-base-strong'),
  margin: `0 ${cssVar('space-3xs')} 0 ${cssVar('space-2xs')}`,
  padding: `${cssVar('space-2xs')} 0`,
});

globalStyle(`.${tabContainer}`, {
  backgroundColor: cssVar('color-base-strong'),
  borderRadius: cssVar('space-3xs'),
  display: 'flex',
  gap: cssVar('space-2xs'),
  margin: cssVar('space-2xs'),
  padding: cssVar('space-3xs'),
});

globalStyle(`.${tab}`, {
  backgroundColor: 'unset',
  border: 'none',
  borderRadius: cssVar('space-3xs'),
  flexGrow: 1,
  padding: cssVar('space-3xs'),
});

globalStyle(`.${tab}:hover`, {
  backgroundColor: cssVar('color-base-x-strong'),
  cursor: 'pointer',
});

globalStyle(getModifiedSelector('active', `.${tab}`), {
  backgroundColor: cssVar('color-base'),
});

globalStyle(getModifiedSelector('active', `.${tab}:hover`), {
  backgroundColor: cssVar('color-base'),
  cursor: 'unset',
});

globalStyle(getModifiedSelector('highlighted', `.${thread}`), {
  backgroundColor: cssVar('color-base-strong'),
});
// TODO Move this style to ui3/Pill when that's available, and reduce its specificity
globalStyle(
  getModifiedSelector('highlighted', `.${thread} .${cordifyClassname('pill')}`),
  {
    backgroundColor: cssVar('color-base-x-strong'),
  },
);

const threadOrThreadListButton = [
  `.${comments} :where(.${threadList} > button)`,
  `.${comments} :where(.${thread} > button)`,
];
globalStyle(threadOrThreadListButton.join(', '), {
  alignItems: 'center',
  background: 'none',
  border: 'none',
  borderRadius: cssVar('space-3xs'),
  cursor: 'pointer',
  display: 'flex',
  gap: cssVar('space-2xs'),
  textAlign: 'left',
  margin: `0 ${cssVar('space-3xs')} 0 ${cssVar('space-2xs')}`,
});
globalStyle(threadOrThreadListButton.map((s) => s + ':hover').join(', '), {
  background: cssVar('color-base-strong'),
});

globalStyle(`.${comments} :where(button.${expandReplies})`, {
  padding: `${cssVar('space-2xs')} calc(${cssVar('space-l')} + ${cssVar(
    'space-2xs',
  )})`,
  color: cssVar('color-brand-primary'),
  '--cord-facepile-avatar-size': cssVar('space-m'),
} as CSSProperties);

globalStyle(`.${comments} :where(.${MODIFIERS.unseen})`, {
  color: cssVar('color-notification'),
});
globalStyle(`.${comments} :where(.${MODIFIERS.unseen}):hover`, {
  backgroundColor: cssVar('color-notification-background'),
});

globalStyle(`.${comments} :where(cord-facepile)`, {
  display: 'contents',
  lineHeight: cssVar('line-height-body'),
});
globalStyle(`.${comments} :where(.${MODIFIERS.unseen} cord-facepile)::before`, {
  background: cssVar('color-notification'),
  borderRadius: '50%',
  content: '',
  height: '8px',
  marginLeft: '-18px',
  width: '8px',
});

globalStyle(`.${repliesContainer}`, {
  marginLeft: cssVar('space-l'),
  paddingLeft: cssVar('space-2xs'),
  display: 'flex',
  flexDirection: 'column',
});

globalStyle(`.${comments} :where(button.${hideReplies})`, {
  color: cssVar('color-content-primary'),
  padding: cssVar('space-2xs'),
  paddingLeft: `calc(${cssVar('space-l')} + ${cssVar('space-2xs')})`,
});

globalStyle(`.${comments} :where(button.${showMore})`, {
  color: cssVar('color-content-primary'),
  padding: cssVar('space-2xs'),
  marginLeft: cssVar('space-2xs'),
});
globalStyle(`.${comments} :where(button.${showMore})::before`, {
  display: 'block',
  content: '',
  // We need to hardcode the width of the horizontal line to make
  // sure that the "Show more" text correctly aligns
  width: '10px',
  borderTop: `1px solid ${cssVar('color-base-x-strong')}`,
});
globalStyle(`.${comments} :where(button.${showMore})::after`, {
  display: 'block',
  content: '',
  flexGrow: 1,
  borderTop: `1px solid ${cssVar('color-base-x-strong')}`,
});

globalStyle(`.${comments} :where(cord-composer)`, {
  flexGrow: '1',
});

globalStyle(`.${comments} :where(.${viewerAvatarWithComposer})`, {
  display: 'flex',
  gap: cssVar('space-2xs'),
  padding: `${cssVar('space-2xs')} ${cssVar('space-3xs')} ${cssVar(
    'space-2xs',
  )} ${cssVar('space-2xs')}`,
  marginLeft: `calc(${cssVar('space-l')} + ${cssVar('space-2xs')})`,
});

globalStyle(`.${comments} :where(.${viewerAvatarWithComposer} > cord-avatar)`, {
  marginTop: '10px',
  '--cord-facepile-avatar-size': cssVar('space-l'),
} as CSSProperties);
