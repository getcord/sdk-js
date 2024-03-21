import * as React from 'react';
import cx from 'classnames';
import type {
  MessageAttachment,
  MessageContent as MessageContentType,
} from '@cord-sdk/types';
import * as classes from '../../../components/MessageContent.classnames.js';
import withCord from '../hoc/withCord.js';
import type { StyleProps } from '../../types.js';
import { MessageFilesAttachments } from './MessageFilesAttachments.js';
import { MessageText } from './MessageText.js';

export type MessageContentProps = {
  content: MessageContentType;
  attachments: MessageAttachment[];
  edited: boolean;
} & StyleProps;

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
          canBeReplaced
          message={undefined}
          content={content}
          wasEdited={edited}
          hideAnnotationAttachment
        />
        <MessageFilesAttachments attachments={attachments} canBeReplaced />
      </div>
    );
  }),
  'MessageContent',
);
