import * as React from 'react';
import { forwardRef, useMemo, useEffect } from 'react';
import cx from 'classnames';

import type { ClientCreateThread, ClientThreadData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import { Message, SendComposer, ThreadHeader } from '../../experimental.js';
import type {
  StyleProps,
  WithByIDComponent,
  ByID,
} from '../../experimental.js';
import { useThread } from '../../hooks/thread.js';
import { useCordContext } from '../../contexts/CordContext.js';
import { ScrollContainer } from '../ScrollContainer.js';
import classes from './Thread.css.js';
import { ThreadSeenByWrapper } from './ThreadSeenBy.js';
import { EmptyThreadPlaceholderWrapper } from './EmptyThreadPlaceholder.js';

type CommonThreadProps = {
  showHeader?: boolean;
} & StyleProps;

export type ThreadByIDProps = {
  threadID: string;
  createThread?: ClientCreateThread;
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
  const { threadID, createThread, ...restProps } = props;
  const thread = useThread(threadID);
  const { sdk: CordSDK } = useCordContext('Thread.ByID');

  useEffect(() => {
    if (thread.thread === null && !createThread) {
      console.warn(`Thread with ID ${threadID} not found.`);
    }
    if (CordSDK && thread.thread === null && createThread) {
      if (createThread.id && createThread.id !== threadID) {
        console.warn(`threadID and createThread.ID should be the same.`);
      } else {
        void CordSDK.thread
          .createThread({ ...createThread, id: threadID })
          .catch(console.warn);
      }
    }
  }, [thread, thread.thread, createThread, CordSDK, threadID]);

  if (!thread) {
    return null;
  }

  return <Thread thread={thread} {...restProps} canBeReplaced />;
}
