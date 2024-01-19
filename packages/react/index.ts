import type {} from '@cord-sdk/jsx';

export type { CordContextValue } from './contexts/CordContext.tsx';
export { CordProvider, CordContext } from './contexts/CordContext.tsx';
export type { LiveCursorsReactComponentProps } from './components/LiveCursors.tsx';
export {
  LiveCursors,
  defaultEventToLocation as liveCursorsDefaultEventToLocation,
  defaultLocationToDocument as liveCursorsDefaultLocationToDocument,
} from './components/LiveCursors.tsx';
export type { LiveCursorsCursorProps } from './components/LiveCursorsDefaultCursor.tsx';
export {
  LiveCursorsDefaultCursor,
  LiveCursorsDefaultClick,
} from './components/LiveCursorsDefaultCursor.tsx';
export type { PagePresenceReactComponentProps } from './components/PagePresence.tsx';
export { PagePresence } from './components/PagePresence.tsx';
export type { PresenceFacepileReactComponentProps } from './components/PresenceFacepile.tsx';
export { PresenceFacepile } from './components/PresenceFacepile.tsx';
export type { PresenceObserverReactComponentProps } from './components/PresenceObserver.tsx';
export { PresenceObserver } from './components/PresenceObserver.tsx';
export type { SidebarReactComponentProps } from './components/Sidebar.tsx';
export { Sidebar } from './components/Sidebar.tsx';
export type { SidebarLauncherReactComponentProps } from './components/SidebarLauncher.tsx';
export { SidebarLauncher } from './components/SidebarLauncher.tsx';
export type { ThreadReactComponentProps } from './components/Thread.tsx';
export { Thread } from './components/Thread.tsx';
export type { ThreadListReactComponentProps } from './components/ThreadList.tsx';
export { ThreadList } from './components/ThreadList.tsx';
export { useCordContext, useCordLocation } from './hooks/useCordLocation.ts';
export type { PresenceReducerOptions } from './types.ts';
export {
  useCordAnnotationTargetRef,
  useCordAnnotationCaptureHandler,
  useCordAnnotationClickHandler,
  useCordAnnotationRenderer,
} from './hooks/useCordAnnotationTargetRef.ts';
export { useCordTranslation, CordTrans } from './hooks/useCordTranslation.tsx';
export type { InboxLauncherReactComponentProps } from './components/InboxLauncher.tsx';
export { InboxLauncher } from './components/InboxLauncher.tsx';
export type { InboxReactComponentProps } from './components/Inbox.tsx';
export { Inbox } from './components/Inbox.tsx';
export type {
  FloatingThreadsReactComponentProps,
  FloatingThreadsReactComponentProps as AnchoredThreadsReactComponentProps,
} from './components/FloatingThreads.tsx';
export {
  FloatingThreads,
  FloatingThreads as AnchoredThreads,
} from './components/FloatingThreads.tsx';
export type { NotificationListReactComponentProps } from './components/NotificationList.tsx';
export { NotificationList } from './components/NotificationList.tsx';
export type { NotificationReactComponentProps } from './components/Notification.tsx';
export { Notification } from './components/Notification.tsx';
export type { NotificationListLauncherReactComponentProps } from './components/NotificationListLauncher.tsx';
export { NotificationListLauncher } from './components/NotificationListLauncher.tsx';
export type { AvatarReactComponentProps } from './components/Avatar.tsx';
export { Avatar } from './components/Avatar.tsx';
export type { ComposerReactComponentProps } from './components/Composer.tsx';
export { Composer } from './components/Composer.tsx';
export type { FacepileReactComponentProps } from './components/Facepile.tsx';
export { Facepile } from './components/Facepile.tsx';
export type { MessageReactComponentProps } from './components/Message.tsx';
export { Message } from './components/Message.tsx';
export type { PinReactComponentProps } from './components/Pin.tsx';
export { Pin } from './components/Pin.tsx';
export type { ThreadedCommentsReactComponentProps } from './components/ThreadedComments.tsx';
export { ThreadedComments } from './components/ThreadedComments.tsx';
export type { TimestampReactComponentProps } from './components/Timestamp.tsx';
export { Timestamp } from './components/Timestamp.tsx';
export type { ReactionsReactComponentProps } from './components/Reactions.tsx';
export { Reactions } from './components/Reactions.tsx';
export type { MessageContentReactComponentProps } from './components/MessageContent.tsx';
export { MessageContent } from './components/MessageContent.tsx';

export * as notification from './hooks/notification.ts';
export * as presence from './hooks/presence.ts';
export * as thread from './hooks/thread.ts';
export * as user from './hooks/user.ts';

export * as experimental from './experimental.ts';

// --- Exports kept for backwards-compat only:

export * as beta from './beta.ts';
export { useSummary as useCordNotificationSummary } from './hooks/notification.ts';
export { useLocationData as useCordPresentUsers } from './hooks/presence.ts';
export {
  useLocationSummary as useCordThreadActivitySummary,
  useThreadSummary as useCordThreadSummary,
} from './hooks/thread.ts';
