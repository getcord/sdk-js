import { addSpaceVars, cssVar } from '../../common/ui/cssVariables.js';
import { globalStyle } from '../../common/ui/style.js';
import * as classes from './Threads.classnames.js';
export default classes;

const {
  inlineReplyButton,
  collapseInlineThreadButton,
  threads,
  inlineThread,
  inlineComposer,
} = classes;
globalStyle(`.${threads}`, {
  position: 'relative',
  border: `1px solid ${cssVar('color-base-x-strong')}`,
  padding: cssVar('space-2xs'),
  borderRadius: cssVar('space-3xs'),
  display: 'flex',
  flexDirection: 'column',
  gap: cssVar('space-2xs'),
  backgroundColor: cssVar('color-base'),
});
globalStyle(`.${inlineThread}`, {
  display: 'flex',
  flexDirection: 'column',
});

globalStyle(`.${inlineReplyButton}, .${collapseInlineThreadButton}`, {
  padding: `${cssVar('space-2xs')} calc(${cssVar('space-l')} + ${cssVar(
    'space-2xs',
  )})`,
  color: cssVar('color-brand-primary'),
  background: 'none',
  gap: cssVar('space-2xs'),
  cursor: 'pointer',
  borderRadius: cssVar('space-3xs'),
  display: 'flex',
});
globalStyle(
  `:is(.${inlineReplyButton}, .${collapseInlineThreadButton}):hover`,
  {
    background: cssVar('color-base-strong'),
  },
);

globalStyle(`.${inlineComposer}`, {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  paddingLeft: '8px',
  marginLeft: addSpaceVars('l', '2xs'),
});
