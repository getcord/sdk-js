import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientMessageData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as classes from '../../components/Message.classnames.js';

export type MessageLayoutProps = {
  message: ClientMessageData;
  messageContent: JSX.Element;
  avatar: JSX.Element;
  emojiPicker: JSX.Element;
  timestamp: JSX.Element;
  optionsMenu: JSX.Element;
  reactions: JSX.Element;
  authorName: JSX.Element;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Replacing MessageLayout enables rendering Message components
 * in any layout. This allows you to completely change the DOM structure,
 * and achieve design that would be hard or impossible with CSS alone.
 *
 * Through the props you get all elements of the message, already rendered.
 */
export const MessageLayout = withCord<MessageLayoutProps>(
  forwardRef(function MessageLayout(
    props: MessageLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      message,
      avatar,
      timestamp,
      optionsMenu,
      emojiPicker,
      messageContent,
      reactions,
      authorName,
      className,
      ...restProps
    } = props;

    return (
      <div
        {...restProps}
        className={cx(className, classes.message)}
        ref={ref}
        data-cord-message-id={message.id}
        data-cord-thread-id={message.threadID}
      >
        {avatar}
        {authorName}
        {timestamp}
        <div className={classes.optionsMenuTrigger}>
          <div className="cord-message-options-buttons">
            {optionsMenu}
            {emojiPicker}
          </div>
        </div>
        {messageContent}
        {reactions}
      </div>
    );
  }),
  'MessageLayout',
);
