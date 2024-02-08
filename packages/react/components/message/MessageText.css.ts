import type { CSSProperties } from 'react';
import { globalStyle } from '@vanilla-extract/css';
import Sizes from '../../common/const/Sizes';
import { cordifyClassname } from '../../common/util';
import { editorStyles } from '../../common/lib/editor/styles';

export const messageText = cordifyClassname('message-text');
globalStyle(`.${messageText}`, {
  ...editorStyles,
  gridArea: 'messageText',
});

globalStyle(`.${messageText} > :where(:not(:first-child))`, {
  marginTop: `${Sizes.MESSAGE_PARAGRAPH_TOP_MARGIN}px`,
});

globalStyle(`:where(.cord-component-thread-list) .${messageText}`, {
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  // Supported on latest versions of Chrome, Edge, Safari, FF and Opera.
  '-webkit-line-clamp': 'none',
} as CSSProperties);

export const structuredMessageCustomRenderNode = cordifyClassname(
  'structured-message-custom-render-node',
);
globalStyle(`.${structuredMessageCustomRenderNode}`, {
  display: 'contents',
});
