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
