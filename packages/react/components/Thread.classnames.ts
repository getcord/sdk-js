import { cordifyClassname } from '../common/util';

export const container = cordifyClassname('cord-thread-container');
export const inlineThread = cordifyClassname('inline-thread');

// MessageBlock
export const messageBlock = cordifyClassname('message-block');

// UnreadMessageIndicator
export const unreadMessageIndicator = cordifyClassname(
  'unread-message-indicator',
);
export const subscribed = cordifyClassname('subscribed');

// TypingUsers
export const typing = cordifyClassname('typing-indicator-container');
export const typingIndicator = cordifyClassname('typing-indicators');

// ThreadHeader
export const threadHeader = cordifyClassname('thread-header-container');

// ResolvedThreadHeader
export const resolvedThreadHeader = cordifyClassname(
  'resolved-thread-header-container',
);
export const resolvedThreadHeaderText = cordifyClassname(
  'resolved-thread-header-text',
);

// CollapsedThread
export const collapsedThread = cordifyClassname('collapsed-thread');

export const threadFooterContainer = cordifyClassname(
  'thread-footer-container',
);

// LoadOlderMessages
export const loadOlderMessages = cordifyClassname(
  'load-older-messages-container',
);

// EmptyStateWithFacepile
export const emptyStatePlaceholderContainer = cordifyClassname(
  'empty-state-placeholder',
);
export const emptyStatePlaceholderTitle = cordifyClassname('title');
export const emptyStatePlaceholderBody = cordifyClassname('body');
