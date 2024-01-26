import * as React from 'react';
import { forwardRef } from 'react';
import type { MessageContent as MessageContentType } from '@cord-sdk/types';
import type { ClientMessageData } from '@cord-sdk/types/message.ts';
import withCord from '../experimental/components/hoc/withCord.tsx';
import {
  Avatar,
  Button,
  MessageContent,
  OptionsMenu,
  Timestamp,
} from '../experimental.ts';
import { Icon } from '../components/helpers/Icon.tsx';

export type MessageProps = {
  message: ClientMessageData;
  threadID: string;
} & React.HTMLAttributes<HTMLDivElement>;
export const Message = withCord<React.PropsWithChildren<MessageProps>>(
  forwardRef(function Message({
    message,
    threadID,
    ...restProps
  }: MessageProps) {
    return (
      <div {...restProps}>
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
        <MessageContent
          // [ONI]-TODO: fix type in MessageContent and below
          // content is merged with HTMLAttributes<HTMLDivElement>['content']
          content={message.content as MessageContentType & string}
          attachments={message.attachments}
          // [ONI]-TODO: implement
          edited={false}
          canBeReplaced
        />
      </div>
    );
  }),
  'Message',
);
