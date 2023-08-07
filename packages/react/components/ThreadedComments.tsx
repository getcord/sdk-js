import * as React from 'react';
import cx from 'classnames';
import type {
  Location,
  MessageInfo,
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
import * as classes from './ThreadedComments.css';
import { Composer } from './Composer';
import { Avatar } from './Avatar';
import { Facepile } from './Facepile';
import { Message } from './Message';

const THREADED_COMMENTS_COMPONENT_NAME = 'CORD-THREADED-COMMENTS';

type ShowReplies =
  | 'initiallyCollapsed'
  | 'initiallyExpanded'
  | 'alwaysCollapsed';
type MessageOrder = 'newest_on_top' | 'newest_on_bottom';
type ComposerPosition = 'top' | 'bottom' | 'none';
export type ThreadedCommentsReactComponentProps = {
  location: Location;
  className?: string;
  messageOrder?: MessageOrder;
  composerPosition?: ComposerPosition;
  composerExpanded?: boolean;
  showReplies?: ShowReplies;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onRender?: () => unknown;
  onLoading?: () => unknown;
};

export function ThreadedComments({
  className,
  location,
  messageOrder = 'newest_on_bottom',
  composerPosition = 'bottom',
  composerExpanded = false,
  showReplies = 'initiallyCollapsed',
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onRender,
  onLoading,
}: ThreadedCommentsReactComponentProps) {
  const { threads, hasMore, loading, fetchMore } = thread.useLocationData(
    location,
    {
      sortBy: 'first_message_timestamp',
      sortDirection: 'descending',
      includeResolved: false,
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
      onMessageClick={onMessageClick}
      onMessageMouseEnter={onMessageMouseEnter}
      onMessageMouseLeave={onMessageMouseLeave}
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
  const showComposer = composerPosition !== 'none';
  const composer = (
    <Composer location={location} showExpanded={composerExpanded} />
  );

  return (
    <div className={cx(classes.comments, className)}>
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

function CommentsThread({
  threadId,
  threadExtraClassnames,
  showReplies,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
}: {
  threadId: string;
  threadExtraClassnames: string | null;
  showReplies: ShowReplies;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
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

  const hasReplies = threadSummary.total > 1;
  const showReplyComponent = allowReplies && (!hasReplies || showingReplies);

  return (
    <div
      className={cx(classes.thread, extraClassnames)}
      data-cord-thread-id={threadId}
    >
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
        />
      ) : (
        <CollapsedReplies
          threadSummary={threadSummary}
          onClick={handleCollapsedRepliesClick}
        />
      )}
      {showReplyComponent && (
        <ReplyComponent
          threadId={threadId}
          showingComposer={showingComposer}
          setShowingComposer={setShowingComposer}
        />
      )}
    </div>
  );
}

function CollapsedReplies({
  threadSummary,
  onClick,
}: {
  threadSummary: ThreadSummary;
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
  const hasReplies = threadSummary.total > 1;
  const replyNumber = threadSummary.total - 1;

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
          <Facepile users={threadSummary.repliers} enableTooltip={false} />
          {hasUnread
            ? pluralize(unreadNumber, 'new reply', 'new replies')
            : pluralize(replyNumber, 'reply', 'replies')}
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
}: {
  threadId: string;
  threadData: ThreadData;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
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
}: {
  threadId: string;
  onClose: () => void;
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
      />
    </div>
  );
}

function ReplyComponent({
  threadId,
  showingComposer,
  setShowingComposer,
}: {
  threadId: string;
  showingComposer: boolean;
  setShowingComposer: Dispatch<SetStateAction<boolean>>;
}) {
  return showingComposer ? (
    <ViewerAvatarWithComposer
      threadId={threadId}
      onClose={() => setShowingComposer(false)}
    />
  ) : (
    <button
      className={cx(classes.expandReplies, fonts.fontSmall)}
      onClick={() => setShowingComposer(true)}
      type="button"
    >
      {'Reply'}
    </button>
  );
}
