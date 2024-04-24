import * as React from 'react';
import cx from 'classnames';
import type {
  ClientUserData,
  MessageAttachment,
  MessageContent as MessageContentType,
} from '@cord-sdk/types';
import { useMemo } from 'react';
import classes from '../../../components/MessageContent.css.js';
import withCord from '../hoc/withCord.js';
import type { StyleProps } from '../../types.js';
import { isMessageFileAttachment } from '../../../common/lib/isMessageFileAttachment.js';
import { MessageFilesAttachments } from './MessageFilesAttachments.js';
import { MessageText } from './MessageText.js';

export type MessageContentProps = {
  content: MessageContentType;
  attachments: MessageAttachment[];
  edited: boolean;
  createdAt?: Date;
  authorData: ClientUserData | null | undefined;
} & StyleProps;

export const MessageContent = withCord<
  React.PropsWithChildren<MessageContentProps>
>(
  React.forwardRef(function MessageContent(
    {
      content,
      createdAt,
      attachments,
      edited,
      className,
      authorData,
      ...rest
    }: MessageContentProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const filesAttachments = useMemo(
      () => attachments.filter(isMessageFileAttachment),
      [attachments],
    );

    if (!content) {
      return null;
    }

    return (
      <div
        className={cx(classes.messageContent, className)}
        ref={ref}
        {...rest}
      >
        <MessageText
          canBeReplaced
          message={undefined}
          content={content}
          wasEdited={edited}
          hideAnnotationAttachment
        />
        <MessageFilesAttachments
          attachments={filesAttachments}
          canBeReplaced
          authorData={authorData}
          createdAt={createdAt}
        />
      </div>
    );
  }),
  'MessageContent',
);
