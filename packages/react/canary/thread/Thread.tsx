import * as React from 'react';
import { forwardRef, useMemo, useEffect } from 'react';

import withCord from '../../experimental/components/hoc/withCord.js';
import { Message, SendComposer, ThreadHeader } from '../../betaV2.js';
import type {
  WithByIDComponent,
  ByID,
  ThreadProps,
  ThreadByIDProps,
} from '../../betaV2.js';
import { useThread } from '../../hooks/thread.js';
import { useCordContext } from '../../contexts/CordContext.js';
import { ThreadSeenByWrapper } from './ThreadSeenBy.js';
import { EmptyThreadPlaceholderWrapper } from './EmptyThreadPlaceholder.js';
import { ThreadLayout } from './ThreadLayout.js';

export const Thread: WithByIDComponent<ThreadProps, ThreadByIDProps> =
  Object.assign(
    withCord<React.PropsWithChildren<ThreadProps>>(
      forwardRef(function Thread(
        { showHeader = false, threadData, ...restProps }: ThreadProps,
        ref: React.ForwardedRef<HTMLDivElement>,
      ) {
        const thread = useMemo(() => threadData?.thread, [threadData?.thread]);
        const messages = useMemo(
          () => threadData?.messages ?? [],
          [threadData?.messages],
        );

        return (
          <ThreadLayout
            ref={ref}
            canBeReplaced
            threadData={threadData}
            header={
              <ThreadHeader
                canBeReplaced
                threadID={thread?.id}
                showContextMenu={messages.length > 0}
                hide={!showHeader}
              />
            }
            messages={messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                showThreadOptions={
                  !showHeader && thread?.firstMessage?.id === message.id
                }
                canBeReplaced
              />
            ))}
            emptyThreadPlaceholder={
              <EmptyThreadPlaceholderWrapper
                groupID={thread?.groupID}
                threadData={threadData}
              />
            }
            threadSeenBy={
              <ThreadSeenByWrapper
                participants={thread?.participants ?? []}
                message={thread?.lastMessage}
              />
            }
            composer={<SendComposer threadID={thread?.id} />}
            {...restProps}
          />
        );
      }),
      'Thread',
    ),
    { ByID: ThreadByID },
  );

function ThreadByID(props: ByID<ThreadByIDProps>) {
  const { threadID, createThread, ...restProps } = props;
  const threadData = useThread(threadID);
  const { sdk: CordSDK } = useCordContext('Thread.ByID');

  useEffect(() => {
    if (threadData.thread === null && !createThread) {
      console.warn(`Thread with ID ${threadID} not found.`);
    }
    if (CordSDK && threadData.thread === null && createThread) {
      if (createThread.id && createThread.id !== threadID) {
        console.warn(`threadID and createThread.ID should be the same.`);
      } else {
        void CordSDK.thread
          .createThread({ ...createThread, id: threadID })
          .catch(console.warn);
      }
    }
  }, [createThread, CordSDK, threadID, threadData.thread]);

  if (!threadData) {
    return null;
  }

  return <Thread threadData={threadData} {...restProps} canBeReplaced />;
}
