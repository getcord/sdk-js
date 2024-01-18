import type {} from '@cord-sdk/jsx';

export {
  CordProvider,
  CordContext,
  CordContextValue,
} from './contexts/CordContext.tsx';
export {
  LiveCursors,
  LiveCursorsReactComponentProps,
  defaultEventToLocation as liveCursorsDefaultEventToLocation,
  defaultLocationToDocument as liveCursorsDefaultLocationToDocument,
} from './components/LiveCursors.tsx';
export {
  LiveCursorsCursorProps,
  LiveCursorsDefaultCursor,
  LiveCursorsDefaultClick,
} from './components/LiveCursorsDefaultCursor.tsx';
export {
  PagePresence,
  PagePresenceReactComponentProps,
} from './components/PagePresence.tsx';
export {
  PresenceFacepile,
  PresenceFacepileReactComponentProps,
} from './components/PresenceFacepile.tsx';
export {
  PresenceObserver,
  PresenceObserverReactComponentProps,
} from './components/PresenceObserver.tsx';
export { Sidebar, SidebarReactComponentProps } from './components/Sidebar.tsx';
export {
  SidebarLauncher,
  SidebarLauncherReactComponentProps,
} from './components/SidebarLauncher.tsx';
export { Thread, ThreadReactComponentProps } from './components/Thread.tsx';
export {
  ThreadList,
  ThreadListReactComponentProps,
} from './components/ThreadList.tsx';
export { useCordContext, useCordLocation } from './hooks/useCordLocation.ts';
export { PresenceReducerOptions } from './types.ts';
export {
  useCordAnnotationTargetRef,
  useCordAnnotationCaptureHandler,
  useCordAnnotationClickHandler,
  useCordAnnotationRenderer,
} from './hooks/useCordAnnotationTargetRef.ts';
export { useCordTranslation, CordTrans } from './hooks/useCordTranslation.tsx';
export {
  InboxLauncher,
  InboxLauncherReactComponentProps,
} from './components/InboxLauncher.tsx';
export { Inbox, InboxReactComponentProps } from './components/Inbox.tsx';
export {
  FloatingThreads,
  FloatingThreadsReactComponentProps,
  // TODO(flooey): Renamed on 2022-08-31; clean up when all usages are gone
  FloatingThreads as AnchoredThreads,
  FloatingThreadsReactComponentProps as AnchoredThreadsReactComponentProps,
} from './components/FloatingThreads.tsx';
export {
  NotificationList,
  NotificationListReactComponentProps,
} from './components/NotificationList.tsx';
export {
  Notification,
  NotificationReactComponentProps,
} from './components/Notification.tsx';
export {
  NotificationListLauncher,
  NotificationListLauncherReactComponentProps,
} from './components/NotificationListLauncher.tsx';
export { Avatar, AvatarReactComponentProps } from './components/Avatar.tsx';
export {
  ComposerReactComponentProps,
  Composer,
} from './components/Composer.tsx';
export {
  FacepileReactComponentProps,
  Facepile,
} from './components/Facepile.tsx';
export { MessageReactComponentProps, Message } from './components/Message.tsx';
export { Pin, PinReactComponentProps } from './components/Pin.tsx';
export {
  ThreadedComments,
  ThreadedCommentsReactComponentProps,
} from './components/ThreadedComments.tsx';
export {
  Timestamp,
  TimestampReactComponentProps,
} from './components/Timestamp.tsx';
export {
  Reactions,
  ReactionsReactComponentProps,
} from './components/Reactions.tsx';
export {
  MessageContentReactComponentProps,
  MessageContent,
} from './components/MessageContent.tsx';

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
