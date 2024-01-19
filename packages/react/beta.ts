// This file is kept purely for backwards compatibility reasons.
// Everything here should either be available directly or can be found under experimental.
export type {
  FloatingThreadsReactComponentProps,
  FloatingThreadsReactComponentProps as AnchoredThreadsReactComponentProps,
} from './components/FloatingThreads.tsx';
export {
  FloatingThreads,
  FloatingThreads as AnchoredThreads,
} from './components/FloatingThreads.tsx';

export type { SelectionCommentsReactComponentProps } from './components/SelectionComments.tsx';
export { SelectionComments } from './components/SelectionComments.tsx';

export type { NotificationListReactComponentProps } from './components/NotificationList.tsx';
export { NotificationList } from './components/NotificationList.tsx';

export type { NotificationListLauncherReactComponentProps } from './components/NotificationListLauncher.tsx';
export { NotificationListLauncher } from './components/NotificationListLauncher.tsx';

export { useThreadSummary as useCordThreadSummary } from './hooks/thread.ts';

export type { PinReactComponentProps } from './components/Pin.tsx';
export { Pin } from './components/Pin.tsx';
// Please DO NOT add anything new here!
