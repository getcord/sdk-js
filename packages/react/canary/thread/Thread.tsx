import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import {
  Button,
  OptionsMenu,
  Message,
  SendComposer,
} from '../../experimental.js';
import classes from '../Thread.css.js';
import type { StyleProps } from '../../experimental.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';
import { ThreadSeenByWrapper } from './ThreadSeenBy.js';

export type ThreadProps = {
  thread?: ClientThreadData;
  showHeader?: boolean;
} & StyleProps;

export const Thread = withCord<React.PropsWithChildren<ThreadProps>>(
  forwardRef(function Thread(
    props: ThreadProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { showHeader = false, thread, className, ...restProps } = props;
    const threadData = thread?.thread;
    const messages = thread?.messages ?? [];

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
        <div>
          {messages.length > 0 &&
            threadData?.id &&
            messages.map((message) => {
              return (
                <Message key={message.id} message={message} canBeReplaced />
              );
            })}
        </div>
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
      <div
        {...restProps}
        ref={ref}
        className={cx(className, classes.threadHeader)}
      >
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
          className={buttonClasses.colorsSecondary}
        />
      </div>
    );
  }),
  'ThreadHeader',
);
