import * as React from 'react';
import cx from 'classnames';
import type {
  MessageAttachment,
  MessageContent as MessageContentType,
} from '@cord-sdk/types';
import * as classes from '../../../components/MessageContent.classnames.ts';
import withCord from '../hoc/withCord.tsx';
import { MessageFilesAttachments } from './MessageFilesAttachments.tsx';
import { MessageText } from './MessageText.tsx';

export type MessageContentProps = {
  content: MessageContentType;
  attachments: MessageAttachment[];
  edited: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const MessageContent = withCord<
  React.PropsWithChildren<MessageContentProps>
>(
  React.forwardRef(function MessageContent(
    { content, attachments, edited, className }: MessageContentProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    if (!content) {
      return null;
    }

    return (
      <div className={cx(classes.messageContent, className)} ref={ref}>
        <MessageText
          message={undefined}
          content={content}
          wasEdited={edited}
          hideAnnotationAttachment
        />
        <MessageFilesAttachments attachments={attachments} />
      </div>
    );
  }),
  'MessageContent',
);
