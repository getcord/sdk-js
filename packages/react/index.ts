import type {} from '@cord-sdk/jsx';

export { CordProvider, CordContext } from './contexts/CordContext';
export {
  MultipleCursors,
  MultipleCursorsReactComponentProps,
} from './components/MultipleCursors';
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
export { useCordThreadActivitySummary } from './hooks/useCordThreadActivitySummary';
export {
  InboxLauncher,
  InboxLauncherReactComponentProps,
} from './components/InboxLauncher';
export { Inbox, InboxReactComponentProps } from './components/Inbox';
export { Settings, SettingsReactComponentProps } from './components/Settings';
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
  NotificationListLauncher,
  NotificationListLauncherReactComponentProps,
} from './components/NotificationListLauncher';
export { useCordThreadSummary } from './hooks/useCordThreadSummary';
export { useCordNotificationSummary } from './hooks/useCordNotificationSummary';

export * as presence from './hooks/presence';
export * as experimental from './experimental';

// --- Exports kept for backwards-compat only:

export * as beta from './beta';
export { useLocationData as useCordPresentUsers } from './hooks/presence';
