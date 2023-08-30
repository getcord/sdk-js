import { cordifyClassname } from '../common/util';

export const comments = cordifyClassname('threaded-comments');

export const threadList = cordifyClassname('threaded-comments-thread-list');

export const thread = cordifyClassname('threaded-comments-thread');
export const resolvedThreadHeader = cordifyClassname(
  'threaded-comments-resolved-thread-header',
);
export const reopenButton = cordifyClassname('threaded-comments-reopen-button');
export const expandReplies = cordifyClassname('expand-replies');
export const repliesContainer = cordifyClassname('replies-container');
export const hideReplies = cordifyClassname('hide-replies');
export const showMore = cordifyClassname('show-more');
export const viewerAvatarWithComposer = cordifyClassname(
  'viewer-avatar-with-composer',
);

export const threadedCommentsClassnameDocs = {
  [threadList]:
    'Applied to the high-level list of threads. Although it is a list of threads, it is not actually a `ThreadList` component, hence the long name.',
  [thread]:
    'Applied to an individual thread. Although it represents a thread, it is not actually a `Thread` component, hence the long name.',
  [resolvedThreadHeader]:
    'Applied to the header which appears above the avatar and name of resolved threads.',
  [reopenButton]:
    'Applied to the "Reopen" button, which appears when hovering on the header of a resolved thread.',
  [expandReplies]:
    'Applied to the button below the first message of each thread, to expand the replies to that thread.',
  [repliesContainer]:
    'Applied to the container holding the `Message` components which are the replies to a thread. This may appear below the initial message of a thread.',
  [hideReplies]: 'Applied to the "hide replies" button.',
  [showMore]:
    'Applied to the button to load more threads, as well as the button to load more messages in a thread.',
  [viewerAvatarWithComposer]:
    'Applied to the container containing the combined viewer avatar and composer, which can appear inside each thread as the "reply" composer.',
};
