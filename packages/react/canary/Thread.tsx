import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types';
import withCord from '../experimental/components/hoc/withCord.js';
import { threadHeader } from '../components/Thread.classnames.js';
import { Button, OptionsMenu } from '../experimental.js';
import { SendComposer } from './composer/Composer.js';
import { Message } from './message/Message.js';

export type ThreadProps = {
  thread?: ClientThreadData;
  showHeader?: boolean;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

export const Thread = withCord<React.PropsWithChildren<ThreadProps>>(
  forwardRef(function Thread(
    { showHeader = false, thread, className, ...restProps }: ThreadProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const threadData = thread?.thread;
    const messages = thread?.messages ?? [];

    return (
      <div
        ref={ref}
        {...restProps}
        className={cx(className, 'cord-component-thread')}
        data-cord-thread-id={threadData?.id}
      >
        {showHeader && (
          <ThreadHeader
            canBeReplaced
            threadID={threadData?.id}
            showContextMenu={messages.length > 0}
          />
        )}
        <div>
          {messages.length > 0 &&
            threadData?.id &&
            messages.map((message) => {
              return (
                <Message
                  key={message.id}
                  threadID={threadData.id}
                  message={message}
                  canBeReplaced
                ></Message>
              );
            })}
        </div>
        <SendComposer threadId={threadData?.id} />
      </div>
    );
  }),
  'Thread',
);

export type ThreadHeaderProps = {
  showContextMenu?: boolean;
  threadID: string | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export const ThreadHeader = withCord<ThreadHeaderProps>(
  forwardRef(function ThreadHeader(
    {
      threadID,
      showContextMenu = true,
      className,
      ...restProps
    }: ThreadHeaderProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <div {...restProps} ref={ref} className={cx(className, threadHeader)}>
        {showContextMenu && threadID && (
          <OptionsMenu
            button={
              <Button
                canBeReplaced
                buttonAction="show-thread-options"
                icon="DotsThree"
              ></Button>
            }
            threadID={threadID}
            showThreadOptions={true}
            showMessageOptions={false}
            canBeReplaced
            setEditing={() => {}}
          />
        )}
        <Button
          canBeReplaced
          buttonAction="close-thread"
          icon="X"
          className="secondary-buttons"
        />
      </div>
    );
  }),
  'ThreadHeader',
);
