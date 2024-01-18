// This file is kept purely for backwards compatibility reasons.
// Everything here should either be available directly or can be found under experimental.
export {
  FloatingThreads,
  FloatingThreadsReactComponentProps,
  // TODO(flooey): Renamed on 2022-08-31; clean up when all usages are gone
  FloatingThreads as AnchoredThreads,
  FloatingThreadsReactComponentProps as AnchoredThreadsReactComponentProps,
} from './components/FloatingThreads.tsx';

export {
  SelectionComments,
  SelectionCommentsReactComponentProps,
} from './components/SelectionComments.tsx';

export {
  NotificationList,
  NotificationListReactComponentProps,
} from './components/NotificationList.tsx';

export {
  NotificationListLauncher,
  NotificationListLauncherReactComponentProps,
} from './components/NotificationListLauncher.tsx';

export { useThreadSummary as useCordThreadSummary } from './hooks/thread.ts';

export { Pin, PinReactComponentProps } from './components/Pin.tsx';
// Please DO NOT add anything new here!
