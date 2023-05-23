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
export { Avatar, AvatarReactComponentProps } from './components/Avatar';
export { ComposerReactComponentProps, Composer } from './components/Composer';
export { FacepileReactComponentProps, Facepile } from './components/Facepile';
export {
  AddReaction,
  AddReactionReactComponentProps,
} from './components/AddReaction';
export { MessageReactComponentProps, Message } from './components/Message';

import * as notification from './hooks/notification';
import * as presence from './hooks/presence';
import * as thread from './hooks/thread';
import * as user from './hooks/user';

import * as experimental from './experimental';

// --- Exports kept for backwards-compat only:

import * as beta from './beta';
export { useSummary as useCordNotificationSummary } from './hooks/notification';
export { useLocationData as useCordPresentUsers } from './hooks/presence';
export {
  useLocationSummary as useCordThreadActivitySummary,
  useThreadSummary as useCordThreadSummary,
} from './hooks/thread';

export { notification, presence, thread, user, experimental, beta };
