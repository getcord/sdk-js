import * as React from 'react';
import cx from 'classnames';
import type {
  ComposerWebComponentEvents,
  Location,
  MessageInfo,
  ResolvedStatus,
  ThreadData,
  ThreadSummary,
} from '@cord-sdk/types';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { logComponentInstantiation, pluralize } from '../common/util';
import * as user from '../hooks/user';
import * as thread from '../hooks/thread';
import { useExtraClassnames } from '../hooks/useExtraClassnames';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import { MODIFIERS } from '../common/ui/modifiers';
import { useCallFunctionOnce } from '../common/effects/useCallFunctionOnce';
import classes from './ThreadedComments.css';
import { Composer } from './Composer';
import { Avatar } from './Avatar';
import { Facepile } from './Facepile';
import { Message } from './Message';
import { Icon } from './helpers/Icon';

const THREADED_COMMENTS_COMPONENT_NAME = 'CORD-THREADED-COMMENTS';

type DisplayResolved =
  | 'interleaved'
  | 'tabbed'
  | 'resolvedOnly'
  | 'unresolvedOnly';
type ShowReplies =
  | 'initiallyCollapsed'
  | 'initiallyExpanded'
  | 'alwaysCollapsed';
type MessageOrder = 'newest_on_top' | 'newest_on_bottom';
type ComposerPosition = 'top' | 'bottom' | 'none';
export type ThreadedCommentsReactComponentProps = {
  location: Location;
  partialMatch?: boolean;
  className?: string;
  messageOrder?: MessageOrder;
  composerPosition?: ComposerPosition;
  composerExpanded?: boolean;
  showReplies?: ShowReplies;
  highlightThreadId?: string;
  displayResolved?: DisplayResolved;
  autofocus?: boolean;
  enableFacepileTooltip?: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
  onRender?: () => unknown;
  onLoading?: () => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
};

export function ThreadedComments({
  className,
  location,
  messageOrder = 'newest_on_bottom',
  composerPosition = 'bottom',
  composerExpanded = false,
  showReplies = 'initiallyCollapsed',
  highlightThreadId,
  partialMatch = false,
  displayResolved = 'unresolvedOnly',
  autofocus = false,
  enableFacepileTooltip = false,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
  onRender,
  onLoading,
  onSend,
}: ThreadedCommentsReactComponentProps) {
  const [resolvedTabSelected, setResolvedTabSelected] = useState<boolean>(
    displayResolved === 'resolvedOnly',
  );
  // The property for ThreadedComments does not correspond 1:1 with the underlying
  // `resolvedStatus` API filter. If we want to see resolved and unresolved threads
  // together, we want to fetch `resolvedStatus: any`. Otherwise we only want to
  // fetch threads with the `resolvedStatus` of the tab which is currently active.
  let resolvedStatus: ResolvedStatus;
  switch (displayResolved) {
    case 'interleaved': {
      resolvedStatus = 'any';
      break;
    }
    case 'tabbed': {
      resolvedStatus = resolvedTabSelected ? 'resolved' : 'unresolved';
      break;
    }
    case 'resolvedOnly': {
      resolvedStatus = 'resolved';
      break;
    }
    case 'unresolvedOnly': {
      resolvedStatus = 'unresolved';
      break;
    }
    default: {
      const _: never = displayResolved;
      resolvedStatus = 'any';
      break;
    }
  }
  const { threads, hasMore, loading, fetchMore } = thread.useLocationData(
    location,
    {
      sortBy: 'first_message_timestamp',
      sortDirection: 'descending',
      partialMatch,
      filter: { resolvedStatus },
    },
  );

  const dispatchLoadingEvent = useCallFunctionOnce(onLoading);
  const dispatchRenderEvent = useCallFunctionOnce(onRender);
  const dispatchLogComponentEvent = useCallFunctionOnce(
    logComponentInstantiation,
  );
  useEffect(() => {
    if (loading) {
      dispatchLoadingEvent();
    } else {
      dispatchRenderEvent();
      dispatchLogComponentEvent(THREADED_COMMENTS_COMPONENT_NAME);
    }
  }, [
    dispatchLoadingEvent,
    dispatchLogComponentEvent,
    dispatchRenderEvent,
    loading,
  ]);

  const renderedThreads = threads.map((oneThread) => (
    <CommentsThread
      key={oneThread.id}
      threadExtraClassnames={oneThread.extraClassnames}
      threadId={oneThread.id}
      showReplies={showReplies}
      highlightThreadId={highlightThreadId}
      enableFacepileTooltip={enableFacepileTooltip}
      onMessageClick={onMessageClick}
      onMessageMouseEnter={onMessageMouseEnter}
      onMessageMouseLeave={onMessageMouseLeave}
      onMessageEditStart={onMessageEditStart}
      onMessageEditEnd={onMessageEditEnd}
      onSend={onSend}
    />
  ));

  const newestOnTop = messageOrder === 'newest_on_top';
  if (!newestOnTop) {
    renderedThreads.reverse();
  }

  const fetchMoreButton = hasMore && (
    <button
      className={cx(classes.showMore, fonts.fontSmall)}
      onClick={() => void fetchMore(5)}
      type="button"
    >
      {'Fetch more'}
    </button>
  );

  const composerOnTop = composerPosition === 'top';
  // When showing resolved threads only, we don't want to show the composer
  // since it does not make sense to create a new thread which is resolved.
  const showComposer =
    composerPosition !== 'none' && resolvedStatus !== 'resolved';
  const composer = (
    <Composer
      location={location}
      showExpanded={composerExpanded}
      onSend={onSend}
      autofocus={autofocus}
    />
  );

  const resolvedStatusTabs = displayResolved === 'tabbed' && (
    <ResolvedStatusTabs
      showResolved={resolvedTabSelected}
      setShowResolved={setResolvedTabSelected}
    />
  );

  return (
    <div className={cx(classes.comments, className)}>
      {resolvedStatusTabs}
      {composerOnTop && showComposer && composer}
      <div className={classes.threadList}>
        {!newestOnTop && fetchMoreButton}
        {renderedThreads}
        {newestOnTop && fetchMoreButton}
      </div>
      {!composerOnTop && showComposer && composer}
    </div>
  );
}

function ResolvedStatusTabs({
  showResolved,
  setShowResolved,
}: {
  showResolved: boolean;
  setShowResolved: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={classes.tabContainer}>
      <button
        type="button"
        className={cx(fonts.fontSmall, classes.tab, {
          [MODIFIERS.active]: !showResolved,
        })}
        onClick={() => setShowResolved(false)}
      >
        {'Open'}
      </button>
      <button
        type="button"
        className={cx(fonts.fontSmall, classes.tab, {
          [MODIFIERS.active]: showResolved,
        })}
        onClick={() => setShowResolved(true)}
      >
        {'Resolved'}
      </button>
    </div>
  );
}

function CommentsThread({
  threadId,
  threadExtraClassnames,
  showReplies,
  highlightThreadId,
  enableFacepileTooltip,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
  onSend,
}: {
  threadId: string;
  threadExtraClassnames: string | null;
  showReplies: ShowReplies;
  highlightThreadId?: string;
  enableFacepileTooltip: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
}) {
  const threadSummary = thread.useThreadSummary(threadId);
  const threadData = thread.useThreadData(threadId);
  const allowReplies = showReplies !== 'alwaysCollapsed';
  const initiallyExpandedReplies = showReplies === 'initiallyExpanded';
  const [showingReplies, setShowingReplies] = useState<boolean>(
    initiallyExpandedReplies,
  );
  const [showingComposer, setShowingComposer] = useState<boolean>(false);

  const handleCollapsedRepliesClick = useCallback(() => {
    if (allowReplies) {
      setShowingReplies(true);
      // When we have initially expanded replies and a user collapses and
      // reopens a thread, we don't want to show a composer (as we would in initiallyCollapsed)
      // state. We want to show consistent behavior.
      setShowingComposer(!initiallyExpandedReplies);
    }
  }, [allowReplies, initiallyExpandedReplies]);

  const extraClassnames = useExtraClassnames(threadExtraClassnames);

  if (!threadSummary || !threadSummary.firstMessage?.id) {
    return null;
  }

  const isResolved = threadSummary.resolved;
  const hasReplies = threadSummary.total > 1;
  const showReplyComponent = allowReplies && (!hasReplies || showingReplies);

  return (
    <div
      className={cx(classes.thread, extraClassnames, {
        [MODIFIERS.highlighted]: highlightThreadId === threadId,
        [MODIFIERS.resolved]: isResolved,
      })}
      data-cord-thread-id={threadId}
    >
      {isResolved && <ResolvedThreadHeader threadId={threadId} />}
      <Message
        messageId={threadSummary.firstMessage?.id}
        threadId={threadId}
        // Marking a single message as seen is not available just yet. When
        // we have a thread with no replies, we shouldn't be stuck in unread
        // state. If the message has replies, we can wait for the user to open
        // the replies to mark it as seen.
        markAsSeen={threadSummary.total === 1}
        onClick={() =>
          onMessageClick?.({
            threadId,
            messageId: threadSummary.firstMessage?.id ?? '',
          })
        }
        onMouseEnter={() =>
          onMessageMouseEnter?.({
            threadId,
            messageId: threadSummary.firstMessage?.id ?? '',
          })
        }
        onMouseLeave={() =>
          onMessageMouseLeave?.({
            threadId,
            messageId: threadSummary.firstMessage?.id ?? '',
          })
        }
        onEditStart={() =>
          onMessageEditStart?.({
            threadId,
            messageId: threadSummary.firstMessage?.id ?? '',
          })
        }
        onEditEnd={() =>
          onMessageEditEnd?.({
            threadId,
            messageId: threadSummary.firstMessage?.id ?? '',
          })
        }
      />

      {showingReplies &&
      // Don't show the expanded version until we actually have the thread data,
      // to prevent replacing the collapsed version with an empty div while the
      // thread data loads.
      (threadData.messages.length > 0 || !threadData.loading) ? (
        <ThreadReplies
          threadId={threadId}
          threadData={threadData}
          setShowingReplies={setShowingReplies}
          onMessageClick={onMessageClick}
          onMessageMouseEnter={onMessageMouseEnter}
          onMessageMouseLeave={onMessageMouseLeave}
          onMessageEditStart={onMessageEditStart}
          onMessageEditEnd={onMessageEditEnd}
        />
      ) : (
        <CollapsedReplies
          threadSummary={threadSummary}
          enableFacepileTooltip={enableFacepileTooltip}
          onClick={handleCollapsedRepliesClick}
        />
      )}
      {showReplyComponent && (
        <ReplyComponent
          threadId={threadId}
          showingComposer={showingComposer}
          setShowingComposer={setShowingComposer}
          setShowingReplies={setShowingReplies}
          onSend={onSend}
        />
      )}
    </div>
  );
}

function CollapsedReplies({
  threadSummary,
  enableFacepileTooltip,
  onClick,
}: {
  threadSummary: ThreadSummary;
  enableFacepileTooltip: boolean;
  onClick: () => void;
}) {
  // The thread summary has an unread count covering the entire thread. The UI we
  // render below looks like we are talking about the number of unread *replies*,
  // so if the first message itself is unread, subtract that from the number.
  // This prevents, for example, rendering "2 new replies" and then you click and
  // only one message appears (because the first message, already displayed, was
  // included in that count).
  let unreadNumber = threadSummary.unread;
  if (threadSummary.firstMessage && !threadSummary.firstMessage.seen) {
    unreadNumber--;
  }

  const hasUnread = unreadNumber > 0;
  // We are including only user messages in the reply count,
  // as it doesn't make sense to count action messages such as
  // "User X resolved this thread".
  // Then, the number of replies is one less than the total number of messages.
  const replyCount = threadSummary.userMessages - 1;
  const hasReplies = replyCount > 0;

  return (
    <>
      {hasReplies && (
        <button
          className={cx(classes.expandReplies, fonts.fontSmall, {
            [MODIFIERS.unseen]: hasUnread,
          })}
          onClick={onClick}
          type="button"
        >
          <Facepile
            users={threadSummary.repliers}
            enableTooltip={enableFacepileTooltip}
          />
          {hasUnread
            ? pluralize(unreadNumber, 'new reply', 'new replies')
            : pluralize(replyCount, 'reply', 'replies')}
        </button>
      )}
    </>
  );
}

function ThreadReplies({
  threadId,
  threadData,
  setShowingReplies,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
}: {
  threadId: string;
  threadData: ThreadData;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
}) {
  const { messages, hasMore, fetchMore } = threadData;

  // The useThreadData hook will also return the first message, but
  // since we are already rendering it, we need to remove it when
  // we receive it
  const restOfMessages = hasMore ? messages : messages.slice(1);

  const hasReplies = restOfMessages.length > 0;

  return (
    <>
      {hasReplies && (
        <>
          <button
            className={cx(classes.hideReplies, fonts.fontSmall)}
            onClick={() => setShowingReplies(false)}
            type="button"
          >
            {'Hide replies'}
          </button>

          {hasMore && (
            <button
              className={cx(classes.showMore, fonts.fontSmall)}
              onClick={() => void fetchMore(5)}
              type="button"
            >
              {'Show more'}
            </button>
          )}
          <div className={classes.repliesContainer}>
            {restOfMessages.map((message) => {
              return (
                <Message
                  key={message.id}
                  threadId={threadId}
                  messageId={message.id}
                  onClick={() =>
                    onMessageClick?.({
                      threadId,
                      messageId: message.id,
                    })
                  }
                  onMouseEnter={() =>
                    onMessageMouseEnter?.({
                      threadId,
                      messageId: message.id,
                    })
                  }
                  onMouseLeave={() =>
                    onMessageMouseLeave?.({
                      threadId,
                      messageId: message.id,
                    })
                  }
                  onEditStart={() =>
                    onMessageEditStart?.({
                      threadId,
                      messageId: message.id,
                    })
                  }
                  onEditEnd={() =>
                    onMessageEditEnd?.({
                      threadId,
                      messageId: message.id,
                    })
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function ViewerAvatarWithComposer({
  threadId,
  onClose,
  onSend,
}: {
  threadId: string;
  onClose: () => void;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
}) {
  const viewerData = user.useViewerData();
  const userId = viewerData?.id;

  return (
    <div className={classes.viewerAvatarWithComposer}>
      {userId && <Avatar userId={userId} />}
      <Composer
        threadId={threadId}
        showCloseButton
        onClose={onClose}
        size={'small'}
        autofocus
        onSend={onSend}
      />
    </div>
  );
}

function ReplyComponent({
  threadId,
  showingComposer,
  setShowingComposer,
  setShowingReplies,
  onSend,
}: {
  threadId: string;
  showingComposer: boolean;
  setShowingComposer: Dispatch<SetStateAction<boolean>>;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
}) {
  return showingComposer ? (
    <ViewerAvatarWithComposer
      threadId={threadId}
      onClose={() => setShowingComposer(false)}
      onSend={onSend}
    />
  ) : (
    <button
      className={cx(classes.expandReplies, fonts.fontSmall)}
      onClick={() => {
        setShowingComposer(true);
        setShowingReplies(true);
      }}
      type="button"
    >
      {'Reply'}
    </button>
  );
}

function ResolvedThreadHeader({ threadId }: { threadId: string }) {
  const setUnresolved = useCallback(() => {
    if (window.CordSDK) {
      void window.CordSDK.thread.updateThread(threadId, {
        resolved: false,
      });
    }
  }, [threadId]);
  return (
    <div className={cx(classes.resolvedThreadHeader, fonts.fontSmall)}>
      <Icon name={'CheckCircle'} />
      {'Resolved'}
      <button
        type="button"
        className={cx(classes.reopenButton, fonts.fontSmall)}
        onClick={setUnresolved}
      >
        {'Reopen'}
      </button>
    </div>
  );
}
