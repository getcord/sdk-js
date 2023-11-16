import type {} from '@cord-sdk/jsx';

export {
  CordProvider,
  CordContext,
  CordContextValue,
} from './contexts/CordContext';
export {
  LiveCursors,
  LiveCursorsReactComponentProps,
  defaultEventToLocation as liveCursorsDefaultEventToLocation,
  defaultLocationToDocument as liveCursorsDefaultLocationToDocument,
} from './components/LiveCursors';
export {
  LiveCursorsCursorProps,
  LiveCursorsDefaultCursor,
  LiveCursorsDefaultClick,
} from './components/LiveCursorsDefaultCursor';
export {
  PagePresence,
  PagePresenceReactComponentProps,
} from './components/PagePresence';
export {
  PresenceFacepile,
  PresenceFacepileReactComponentProps,
} from './components/PresenceFacepile';
export {
  PresenceObserver,
  PresenceObserverReactComponentProps,
} from './components/PresenceObserver';
export { Sidebar, SidebarReactComponentProps } from './components/Sidebar';
export {
  SidebarLauncher,
  SidebarLauncherReactComponentProps,
} from './components/SidebarLauncher';
export { Thread, ThreadReactComponentProps } from './components/Thread';
export {
  ThreadList,
  ThreadListReactComponentProps,
} from './components/ThreadList';
export { useCordContext, useCordLocation } from './hooks/useCordLocation';
export { PresenceReducerOptions } from './types';
export {
  useCordAnnotationTargetRef,
  useCordAnnotationCaptureHandler,
  useCordAnnotationClickHandler,
  useCordAnnotationRenderer,
} from './hooks/useCordAnnotationTargetRef';
export {
  InboxLauncher,
  InboxLauncherReactComponentProps,
} from './components/InboxLauncher';
export { Inbox, InboxReactComponentProps } from './components/Inbox';
export {
  FloatingThreads,
  FloatingThreadsReactComponentProps,
  // TODO(flooey): Renamed on 2022-08-31; clean up when all usages are gone
  FloatingThreads as AnchoredThreads,
  FloatingThreadsReactComponentProps as AnchoredThreadsReactComponentProps,
} from './components/FloatingThreads';
export {
  NotificationList,
  NotificationListReactComponentProps,
} from './components/NotificationList';
export {
  Notification,
  NotificationReactComponentProps,
} from './components/Notification';
export {
  NotificationListLauncher,
  NotificationListLauncherReactComponentProps,
} from './components/NotificationListLauncher';
export { Avatar, AvatarReactComponentProps } from './components/Avatar';
export { ComposerReactComponentProps, Composer } from './components/Composer';
export { FacepileReactComponentProps, Facepile } from './components/Facepile';
export { MessageReactComponentProps, Message } from './components/Message';
export { Pin, PinReactComponentProps } from './components/Pin';
export {
  ThreadedComments,
  ThreadedCommentsReactComponentProps,
} from './components/ThreadedComments';
export {
  Timestamp,
  TimestampReactComponentProps,
} from './components/Timestamp';
export {
  Reactions,
  ReactionsReactComponentProps,
} from './components/Reactions';
export {
  MessageContentReactComponentProps,
  MessageContent,
} from './components/MessageContent';

export * as notification from './hooks/notification';
export * as presence from './hooks/presence';
export * as thread from './hooks/thread';
export * as user from './hooks/user';

export * as experimental from './experimental';

// --- Exports kept for backwards-compat only:

export * as beta from './beta';
export { useSummary as useCordNotificationSummary } from './hooks/notification';
export { useLocationData as useCordPresentUsers } from './hooks/presence';
export {
  useLocationSummary as useCordThreadActivitySummary,
  useThreadSummary as useCordThreadSummary,
} from './hooks/thread';
