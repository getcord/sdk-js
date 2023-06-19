import type { CSSProperties } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { cssVar } from '../common/ui/cssVariables';
import { MODIFIERS } from '../common/ui/modifiers';

export const comments = cordifyClassname('threaded-comments');
globalStyle(`.${comments}`, {
  width: '320px',
  border: `1px solid ${cssVar('color-base-x-strong')}`,
  padding: cssVar('space-2xs'),
  borderRadius: cssVar('border-radius-medium'),
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
  backgroundColor: cssVar('color-base'),
});

export const threadList = cordifyClassname('threaded-comments-thread-list');
globalStyle(`.${threadList}`, {
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
  height: 'auto',
});

export const thread = cordifyClassname('threaded-comments-thread');
globalStyle(`.${thread}`, {
  display: 'flex',
  flexDirection: 'column',
});

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
});
globalStyle(threadOrThreadListButton.map((s) => s + ':hover').join(', '), {
  background: cssVar('color-base-strong'),
});

export const expandReplies = cordifyClassname('expand-replies');
globalStyle(`.${comments} :where(button.${expandReplies})`, {
  padding: `${cssVar('space-2xs')} calc(${cssVar('space-l')} + ${cssVar(
    'space-2xs',
  )})`,
  margin: `0 ${cssVar('space-3xs')} 0 ${cssVar('space-2xs')}`,
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

export const repliesContainer = cordifyClassname('replies-container');
globalStyle(`.${repliesContainer}`, {
  marginLeft: cssVar('space-l'),
  paddingLeft: cssVar('space-2xs'),
  display: 'flex',
  flexDirection: 'column',
});

export const hideReplies = cordifyClassname('hide-replies');
globalStyle(`.${comments} :where(button.${hideReplies})`, {
  color: cssVar('color-content-primary'),
  padding: cssVar('space-2xs'),
  paddingLeft: `calc(${cssVar('space-l')} + ${cssVar('space-m')})`,
});

export const showMore = cordifyClassname('show-more');
globalStyle(`.${comments} :where(button.${showMore})`, {
  color: cssVar('color-content-primary'),
  padding: cssVar('space-2xs'),
});
globalStyle(`.${comments} :where(button.${showMore})::before`, {
  display: 'block',
  content: '',
  // We need to hardcode the width of the horizontal line to make
  // sure that the "Show more" text correctly aligns
  width: '18px',
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

export const viewerAvatarWithComposer = cordifyClassname(
  'viewer-avatar-with-composer',
);
globalStyle(`.${comments} :where(.${viewerAvatarWithComposer})`, {
  display: 'flex',
  gap: cssVar('space-2xs'),
  padding: `${cssVar('space-2xs')} 0px ${cssVar('space-2xs')} ${cssVar(
    'space-2xs',
  )}`,
  marginLeft: `calc(${cssVar('space-l')} + ${cssVar('space-2xs')})`,
});

globalStyle(`.${comments} :where(.${viewerAvatarWithComposer} > cord-avatar)`, {
  marginTop: '10px',
  '--cord-facepile-avatar-size': cssVar('space-l'),
} as CSSProperties);

export const threadedCommentsClassnameDocs = {
  [threadList]:
    'Applied to the high-level list of threads. Although it is a list of threads, it is not actually a `ThreadList` component, hence the long name.',
  [thread]:
    'Applied to an individual thread. Although it represents a thread, it is not actually a `Thread` component, hence the long name.',
  [expandReplies]:
    'Applied to the button below the first message of each thread, to expand the replies to that thread.',
  [repliesContainer]:
    'Applied to the container holding the `Message` components which are the replies to a thread. This may appear below the initial message of a thread.',
  [hideReplies]: 'Applied to the "hide replies" button.',
  [showMore]:
    'Applied to the button to load more threads, as well as the button to load more messages in a thread.',
  [viewerAvatarWithComposer]:
    'Applied to the container containing the combined viewer avatar and composer, which can appear inside each thread as the "reply" composer.',
};
