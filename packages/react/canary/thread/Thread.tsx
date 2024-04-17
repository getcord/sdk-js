import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import { Message, SendComposer, ThreadHeader } from '../../experimental.js';
import type {
  StyleProps,
  WithByIDComponent,
  ByID,
} from '../../experimental.js';
import { useThread } from '../../hooks/thread.js';
import { ScrollContainer } from '../ScrollContainer.js';
import classes from './Thread.css.js';
import { ThreadSeenByWrapper } from './ThreadSeenBy.js';
import { EmptyThreadPlaceholderWrapper } from './EmptyThreadPlaceholder.js';

type CommonThreadProps = {
  showHeader?: boolean;
} & StyleProps;

export type ThreadByIDProps = {
  threadID: string;
} & CommonThreadProps;

export type ThreadProps = {
  thread?: ClientThreadData;
} & CommonThreadProps;

export const Thread: WithByIDComponent<ThreadProps, ThreadByIDProps> =
  Object.assign(
    withCord<React.PropsWithChildren<ThreadProps>>(
      forwardRef(function Thread(
        { showHeader = false, thread, className, ...restProps }: ThreadProps,
        ref: React.ForwardedRef<HTMLDivElement>,
      ) {
        const threadData = useMemo(() => thread?.thread, [thread?.thread]);
        const messages = useMemo(
          () => thread?.messages ?? [],
          [thread?.messages],
        );

        return (
          <div
            ref={ref}
            {...restProps}
            className={cx(className, classes.thread)}
            data-cord-thread-id={threadData?.id}
          >
            {showHeader && (
              <ThreadHeader
                canBeReplaced
                threadID={threadData?.id}
                showContextMenu={messages.length > 0}
              />
            )}
            {(threadData === null ||
              (threadData !== undefined && !messages.length)) && (
              <EmptyThreadPlaceholderWrapper groupID={threadData?.groupID} />
            )}
            <ScrollContainer>
              {messages.map((message) => (
                <Message key={message.id} message={message} canBeReplaced />
              ))}
            </ScrollContainer>
            {threadData && threadData.lastMessage && (
              <ThreadSeenByWrapper
                participants={threadData.participants}
                message={threadData.lastMessage}
              />
            )}
            <SendComposer threadId={threadData?.id} />
          </div>
        );
      }),
      'Thread',
    ),
    { ByID: ThreadByID },
  );

function ThreadByID(props: ByID<ThreadByIDProps>) {
  const { threadID, ...restProps } = props;
  const thread = useThread(threadID);

  if (!thread) {
    return null;
  }

  return <Thread thread={thread} {...restProps} canBeReplaced />;
}
