import cx from 'classnames';
import type { Location, ThreadSummary } from '@cord-sdk/types';
import { Facepile } from '..';
import { pluralize } from '../common/util';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import * as classes from './Comments.css';
import { Composer } from './Composer';
import { Message } from './Message';
import {
  useLocationData,
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

      <CollapsedReplies threadSummary={threadSummary} />
    </div>
  );
}

function CollapsedReplies({ threadSummary }: { threadSummary: ThreadSummary }) {
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
        >
          {'Reply'}
        </button>
      )}
    </>
  );
}
