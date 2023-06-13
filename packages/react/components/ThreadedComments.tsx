import * as React from 'react';
import cx from 'classnames';
import type { Location, ThreadSummary } from '@cord-sdk/types';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { pluralize } from '../common/util';
import * as user from '../hooks/user';
import * as thread from '../hooks/thread';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import * as classes from './ThreadedComments.css';
import { Composer } from './Composer';
import { Avatar } from './Avatar';
import { Facepile } from './Facepile';
import { Message } from './Message';

type MessageOrder = 'newest_on_top' | 'newest_on_bottom';
type ComposerPosition = 'top' | 'bottom';

export function ThreadedComments({
  location,
  messageOrder = 'newest_on_top',
  composerPosition = 'top',
  composerExpanded = false,
}: {
  location: Location;
  messageOrder?: MessageOrder;
  composerPosition?: ComposerPosition;
  composerExpanded?: boolean;
}) {
  const { threads, hasMore, fetchMore } = thread.useLocationData(location, {
    sortBy: 'first_message_timestamp',
    sortDirection: 'descending',
    includeResolved: false,
  });

  const renderedThreads = threads.map((oneThread) => (
    <CommentsThread key={oneThread.id} threadId={oneThread.id} />
  ));

  const newestOnTop = messageOrder === 'newest_on_top';
  if (!newestOnTop) {
    renderedThreads.reverse();
  }

  const fetchMoreButton = hasMore && (
    <button
      className={cx(classes.showMore, fonts.fontSmall)}
      onClick={() => fetchMore(5)}
    >
      {'Fetch more'}
    </button>
  );

  const composerOnTop = composerPosition === 'top';
  const composer = (
    <Composer location={location} showExpanded={composerExpanded} />
  );

  return (
    <div className={classes.comments}>
      {composerOnTop && composer}
      <div className={classes.threadList}>
        {!newestOnTop && fetchMoreButton}
        {renderedThreads}
        {newestOnTop && fetchMoreButton}
      </div>
      {!composerOnTop && composer}
    </div>
  );
}

function CommentsThread({ threadId }: { threadId: string }) {
  const threadSummary = thread.useThreadSummary(threadId);
  const [showingReplies, setShowingReplies] = useState<boolean>(false);

  if (!threadSummary || !threadSummary.firstMessage?.id) {
    return null;
  }

  return (
    <div className={classes.thread}>
      <Message
        className={classes.firstThreadMessage}
        messageId={threadSummary.firstMessage?.id}
        threadId={threadId}
      />

      {showingReplies ? (
        <ThreadReplies
          threadId={threadId}
          setShowingReplies={setShowingReplies}
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
  const hasUnread = threadSummary.unread > 0;
  const hasReplies = threadSummary.total > 1;
  const replyNumber = threadSummary.total - 1;
  const unreadNumber = threadSummary.unread;

  return (
    <>
      {hasReplies ? (
        <button
          className={cx(classes.expandReplies, fonts.fontSmall, {
            [classes.unread]: hasUnread,
          })}
          onClick={() => setShowingReplies(true)}
        >
          <Facepile
            users={threadSummary.participants.map((p) => p.userID ?? '')}
            className={classes.threadSummaryFacepile}
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
  setShowingReplies,
}: {
  threadId: string;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
}) {
  const { messages, hasMore, fetchMore } = thread.useThreadData(threadId);
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
          >
            {'Hide replies'}
          </button>

          {hasMore && (
            <button
              className={cx(classes.showMore, fonts.fontSmall)}
              onClick={() => fetchMore(5)}
            >
              {'Show more'}
            </button>
          )}
          <div className={classes.replyMessages}>
            {restOfMessages.map((message) => {
              return (
                <Message
                  key={message.id}
                  threadId={threadId}
                  messageId={message.id}
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
      {userId && <Avatar userId={userId} className={classes.avatar} />}
      <Composer
        threadId={threadId}
        showCloseButton
        onClose={() => setShowingReplyComposer(false)}
        size={'small'}
      />
    </div>
  );
}

function ReplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={cx(classes.expandReplies, fonts.fontSmall)}
      onClick={onClick}
    >
      {'Reply'}
    </button>
  );
}
