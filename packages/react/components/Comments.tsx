import cx from 'classnames';
import type { Location, ThreadSummary } from '@cord-sdk/types';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Facepile } from '..';
import { pluralize } from '../common/util';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import * as classes from './Comments.css';
import { Composer } from './Composer';
import { Message } from './Message';
import {
  useLocationData,
  useThreadData,
  useThreadSummary,
} from '@cord-sdk/react/hooks/thread';

export function Comments({ location }: { location: Location }) {
  const { threads, hasMore, fetchMore } = useLocationData(location, {
    sortBy: 'first_message_timestamp',
    sortDirection: 'descending',
    includeResolved: false,
  });

  return (
    <div className={classes.comments}>
      <div className={classes.threadList}>
        {threads.map((thread) => (
          <CommentsThread key={thread.id} threadId={thread.id} />
        ))}
        {hasMore && (
          <button
            className={cx(
              classes.threadActionButtonWithReplies,
              classes.hr,
              fonts.fontSmall,
            )}
            onClick={() => fetchMore(5)}
          >
            {'Fetch more'}
          </button>
        )}
      </div>
      <Composer location={location} />
    </div>
  );
}

function CommentsThread({ threadId }: { threadId: string }) {
  const threadSummary = useThreadSummary(threadId);
  const [showingReplies, setShowingReplies] = useState<boolean>(false);

  if (!threadSummary || !threadSummary.firstMessage?.id) {
    return null;
  }

  return (
    <div className={classes.commentsThread}>
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
          className={cx(
            classes.threadActionButtonWithReplies,
            fonts.fontSmall,
            {
              [classes.unread]: hasUnread,
            },
          )}
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
        <button
          className={cx(classes.threadActionButtonWithReplies, fonts.fontSmall)}
          onClick={() => setShowingReplies(true)}
        >
          {'Reply'}
        </button>
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
  const { messages, hasMore, fetchMore } = useThreadData(threadId);

  // The useThreadData hook will also return the first message, but
  // since we are already rendering it, we need to remove it when
  // we receive it
  const restOfMessages = hasMore ? messages : messages.slice(1);

  const hasReplies = restOfMessages.length > 0;

  return (
    <>
      {hasReplies && (
        <button
          className={cx(classes.messageActionButton, fonts.fontSmall)}
          onClick={() => setShowingReplies(false)}
        >
          {'Hide replies'}
        </button>
      )}
      {hasMore && (
        <button
          className={cx(
            classes.messageActionButton,
            fonts.fontSmall,
            classes.hr,
          )}
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
  );
}
