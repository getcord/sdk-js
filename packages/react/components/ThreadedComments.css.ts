import type { CSSProperties } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { cssVar } from '../common/ui/cssVariables';

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

export const threadList = cordifyClassname('thread-list');
globalStyle(`.${threadList}`, {
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-xs'),
  height: 'auto',
});

export const reverseOrder = cordifyClassname('reverse-order');
globalStyle(`.${reverseOrder}`, {
  flexDirection: 'column-reverse',
});

export const commentsThread = cordifyClassname('threaded-comments-thread');
globalStyle(`.${commentsThread}`, {
  display: 'flex',
  flexDirection: 'column',
});

export const hr = cordifyClassname('hr');
export const threadActionButtonWithReplies = cordifyClassname(
  'thread-action-button-with-replies',
);
globalStyle(`.${threadActionButtonWithReplies}`, {
  padding: `${cssVar('space-2xs')} calc(${cssVar('space-l')} + ${cssVar(
    'space-2xs',
  )})`,
  margin: `0 ${cssVar('space-3xs')} 0 ${cssVar('space-2xs')}`,
  borderRadius: cssVar('space-3xs'),
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: cssVar('space-2xs'),
  '--cord-facepile-avatar-size': cssVar('space-m'),
} as CSSProperties);
globalStyle(`.${threadActionButtonWithReplies}:hover`, {
  background: cssVar('color-base-strong'),
});

export const unread = cordifyClassname('unread');
globalStyle(`.${unread}`, {
  color: cssVar('color-notification'),
});
globalStyle(`.${unread}:hover`, {
  backgroundColor: cssVar('color-notification-background'),
});

export const threadSummaryFacepile = cordifyClassname(
  'thread-summary-facepile',
);
globalStyle(`.${threadSummaryFacepile}`, {
  display: 'contents',
  lineHeight: cssVar('line-height-body'),
});
globalStyle(`.${unread} .${threadSummaryFacepile}::before`, {
  color: cssVar('color-notification'),
  content: '\\2022',
  fontSize: '40px',
  marginLeft: '-20px',
});

export const firstThreadMessage = cordifyClassname('first-thread-message');

export const replyMessages = cordifyClassname('reply-messages');
globalStyle(`.${replyMessages}`, {
  marginLeft: cssVar('space-l'),
  padding: cssVar('space-2xs'),
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
});

export const messageActionButton = cordifyClassname('message-action-button');
globalStyle(`.${messageActionButton}`, {
  color: cssVar('color-content-primary'),
  padding: cssVar('space-2xs'),
  paddingLeft: `calc(${cssVar('space-l')} + ${cssVar('space-m')})`,
  display: 'flex',
  alignItems: 'center',
  gap: cssVar('space-2xs'),
  borderRadius: cssVar('space-3xs'),
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
});
globalStyle(`.${messageActionButton}:hover`, {
  background: cssVar('color-base-strong'),
});
globalStyle(`.${messageActionButton}.${hr}::before`, {
  width: '18px',
});

globalStyle(`.${hr}`, {
  padding: cssVar('space-2xs'),
});
globalStyle(`.${hr}::before`, {
  display: 'block',
  content: '',
  // We need to hardcode the width of the horizontal line to make
  // sure that the "Show more" text correctly aligns
  width: '10px',
  borderTop: `1px solid ${cssVar('color-base-x-strong')}`,
});
globalStyle(`.${hr}::after`, {
  display: 'block',
  content: '',
  flexGrow: 1,
  borderTop: `1px solid ${cssVar('color-base-x-strong')}`,
});

export const composer = cordifyClassname('composer');
globalStyle(`.${composer}`, {
  flexGrow: '1',
});

export const viewerAvatarWithComposer = cordifyClassname(
  'viewer-avatar-with-composer',
);
globalStyle(`.${viewerAvatarWithComposer}`, {
  display: 'flex',
  gap: cssVar('space-2xs'),
  padding: cssVar('space-2xs'),
  marginLeft: `calc(${cssVar('space-l')} + ${cssVar('space-2xs')})`,
});

export const avatar = cordifyClassname('avatar');
globalStyle(`.${avatar}`, {
  marginTop: '10px',
  '--cord-facepile-avatar-size': cssVar('space-l'),
} as CSSProperties);
