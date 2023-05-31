import cx from 'classnames';
import type { Location } from '@cord-sdk/types';
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
              classes.threadActionButton,
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
        className={classes.firstMessage}
        messageId={threadSummary.firstMessage?.id}
        threadId={threadId}
      />
    </div>
  );
}
