import * as React from 'react';
import { forwardRef, useCallback, useContext } from 'react';
import cx from 'classnames';
import type {
  MessageContent as MessageContentType,
  ClientMessageData,
} from '@cord-sdk/types';
import withCord from '../experimental/components/hoc/withCord.js';
import * as classes from '../components/Message.classnames.js';

import {
  Avatar,
  Button,
  MessageContent,
  OptionsMenu,
  Timestamp,
  AddReactionButton,
  Reactions,
} from '../experimental.js';
import { Icon } from '../components/helpers/Icon.js';
import { CordContext } from '../contexts/CordContext.js';

export type MessageProps = {
  message: ClientMessageData;
  threadID: string;
} & React.HTMLAttributes<HTMLDivElement>;
export const Message = withCord<React.PropsWithChildren<MessageProps>>(
  forwardRef(function Message(
    { message, threadID, ...restProps }: MessageProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    const { sdk: cordSDK } = useContext(CordContext);
    const threadSDK = cordSDK?.thread;
    const onAddReaction = useCallback(
      (unicodeReaction: string) => {
        if (threadSDK && threadID && message.id) {
          void threadSDK.updateMessage(threadID, message.id, {
            addReactions: [unicodeReaction],
          });
        }
      },
      [message.id, threadID, threadSDK],
    );

    const onDeleteReaction = useCallback(
      (unicodeReaction: string) => {
        if (threadSDK && threadID && message.id) {
          void threadSDK.updateMessage(threadID, message.id, {
            removeReactions: [unicodeReaction],
          });
        }
      },
      [message.id, threadID, threadSDK],
    );
    return (
      <MessageLayout
        ref={ref}
        canBeReplaced
        avatar={<Avatar canBeReplaced userId={message.authorID} />}
        messageContent={
          <MessageContent
            // [ONI]-TODO: fix type in MessageContent and below
            // content is merged with HTMLAttributes<HTMLDivElement>['content']
            content={message.content as MessageContentType & string}
            attachments={message.attachments}
            // [ONI]-TODO: implement
            edited={false}
            canBeReplaced
          />
        }
        timestamp={
          <Timestamp
            canBeReplaced
            value={message.createdTimestamp}
            type="message"
          />
        }
        optionsMenu={
          <OptionsMenu
            canBeReplaced
            message={message}
            threadID={threadID}
            button={
              <Button buttonAction="show-message-options" type="button">
                <Icon name="DotsThree" size="large" />
              </Button>
            }
            showThreadOptions
            showMessageOptions
          />
        }
        emojiPicker={
          <AddReactionButton
            canBeReplaced
            messageId={message.id}
            onAddReaction={onAddReaction}
            onDeleteReaction={onDeleteReaction}
          />
        }
        reactions={
          <Reactions
            canBeReplaced
            messageId={message.id}
            threadId={threadID}
            showReactionList
            showAddReactionButton
          />
        }
        {...restProps}
      />
    );
  }),
  'Message',
);
export type MessageLayoutProps = {
  messageContent: JSX.Element;
  avatar: JSX.Element;
  emojiPicker: JSX.Element;
  timestamp: JSX.Element;
  optionsMenu: JSX.Element;
  reactions: JSX.Element;
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
      avatar,
      timestamp,
      optionsMenu,
      emojiPicker,
      messageContent,
      reactions,
      className,
      ...restProps
    } = props;
    return (
      <div {...restProps} className={cx(className, classes.message)} ref={ref}>
        {avatar}
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
