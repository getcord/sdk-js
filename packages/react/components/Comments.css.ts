import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { cssVar } from '../common/ui/cssVariables';

export const comments = cordifyClassname('comments');
globalStyle(`.${comments}`, {
  width: '320px',
  border: `1px solid ${cssVar('color-base-x-strong')}`,
  padding: cssVar('space-2xs'),
  borderRadius: cssVar('space-3xs'),
});

export const threadList = cordifyClassname('thread-list');
globalStyle(`.${threadList}`, {
  overflow: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-xs'),
  height: 'auto',
});

export const commentsThread = cordifyClassname('comments-thread');

export const firstMessage = cordifyClassname('first-message');

export const hr = cordifyClassname('hr');
export const threadActionButton = cordifyClassname('thread-action-button');
globalStyle(`.${threadActionButton}`, {
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
});
globalStyle(`.${threadActionButton}:hover`, {
  background: cssVar('color-base-strong'),
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
