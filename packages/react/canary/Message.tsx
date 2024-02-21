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
  forwardRef(function Message({
    message,
    threadID,
    className,
    ...restProps
  }: MessageProps) {
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
      <div {...restProps} className={cx(className, classes.message)}>
        <Avatar canBeReplaced userId={message.authorID} />
        <Timestamp value={message.createdTimestamp} type="message" />
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
        <AddReactionButton
          messageId={message.id}
          onAddReaction={onAddReaction}
          onDeleteReaction={onDeleteReaction}
        />
        <MessageContent
          // [ONI]-TODO: fix type in MessageContent and below
          // content is merged with HTMLAttributes<HTMLDivElement>['content']
          content={message.content as MessageContentType & string}
          attachments={message.attachments}
          // [ONI]-TODO: implement
          edited={false}
          canBeReplaced
        />
        <Reactions
          messageId={message.id}
          threadId={threadID}
          showReactionList
          showAddReactionButton
        />
      </div>
    );
  }),
  'Message',
);
