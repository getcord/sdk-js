import * as React from 'react';
import cx from 'classnames';
import type {
  Location,
  MessageInfo,
  ThreadData,
  ThreadSummary,
} from '@cord-sdk/types';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { pluralize } from '../common/util';
import * as user from '../hooks/user';
import * as thread from '../hooks/thread';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import { MODIFIERS } from '../common/ui/modifiers';
import { useCallFunctionOnce } from '../common/effects/useCallFunctionOnce';
import * as classes from './ThreadedComments.css';
import { Composer } from './Composer';
import { Avatar } from './Avatar';
import { Facepile } from './Facepile';
import { Message } from './Message';

type MessageOrder = 'newest_on_top' | 'newest_on_bottom';
type ComposerPosition = 'top' | 'bottom' | 'none';
export type ThreadedCommentsReactComponentProps = {
  location: Location;
  messageOrder?: MessageOrder;
  composerPosition?: ComposerPosition;
  composerExpanded?: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onRender?: () => unknown;
  onLoading?: () => unknown;
};

export function ThreadedComments({
  location,
  messageOrder = 'newest_on_bottom',
  composerPosition = 'bottom',
  composerExpanded = false,
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
  useEffect(() => {
    if (loading) {
      dispatchLoadingEvent();
    } else {
      dispatchRenderEvent();
    }
  }, [dispatchLoadingEvent, dispatchRenderEvent, loading]);

  const renderedThreads = threads.map((oneThread) => (
    <CommentsThread
      key={oneThread.id}
      threadId={oneThread.id}
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
    <div className={classes.comments}>
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
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
}: {
  threadId: string;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
}) {
  const threadSummary = thread.useThreadSummary(threadId);
  const threadData = thread.useThreadData(threadId);
  const [showingReplies, setShowingReplies] = useState<boolean>(false);

  if (!threadSummary || !threadSummary.firstMessage?.id) {
    return null;
  }

  return (
    <div className={classes.thread} data-cord-thread-id={threadId}>
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
          setShowingReplies={setShowingReplies}
        />
      )}
    </div>
  );
}

function CollapsedReplies({
  threadSummary,
  setShowingReplies,
}: {
  threadSummary: ThreadSummary;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
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
      {hasReplies ? (
        <button
          className={cx(classes.expandReplies, fonts.fontSmall, {
            [MODIFIERS.unseen]: hasUnread,
          })}
          onClick={() => setShowingReplies(true)}
          type="button"
        >
          <Facepile
            users={threadSummary.participants.map((p) => p.userID ?? '')}
            enableTooltip={false}
          />
          {hasUnread
            ? pluralize(unreadNumber, 'new reply', 'new replies')
            : pluralize(replyNumber, 'reply', 'replies')}
        </button>
      ) : (
        <ReplyButton onClick={() => setShowingReplies(true)} />
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
  const [showingReplyComposer, setShowingReplyComposer] =
    useState<boolean>(true);

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
      {showingReplyComposer ? (
        <ViewerAvatarWithComposer
          threadId={threadId}
          setShowingReplyComposer={setShowingReplyComposer}
        />
      ) : (
        <ReplyButton onClick={() => setShowingReplyComposer(true)} />
      )}
    </>
  );
}

function ViewerAvatarWithComposer({
  threadId,
  setShowingReplyComposer,
}: {
  threadId: string;
  setShowingReplyComposer: Dispatch<SetStateAction<boolean>>;
}) {
  const viewerData = user.useViewerData();
  const userId = viewerData?.id;

  return (
    <div className={classes.viewerAvatarWithComposer}>
      {userId && <Avatar userId={userId} />}
      <Composer
        threadId={threadId}
        showCloseButton
        onClose={() => setShowingReplyComposer(false)}
        size={'small'}
        autofocus
      />
    </div>
  );
}

function ReplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={cx(classes.expandReplies, fonts.fontSmall)}
      onClick={onClick}
      type="button"
    >
      {'Reply'}
    </button>
  );
}
