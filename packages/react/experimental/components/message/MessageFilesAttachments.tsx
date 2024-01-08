import React, { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import type {
  MessageAttachment,
  MessageFileAttachment as MessageFileAttachmentType,
  UUID,
} from '@cord-sdk/types';
import {
  isInlineDisplayableImage,
  isInlineDisplayableVideo,
} from '../../../common/lib/uploads';
import { isNotNull } from '../../../common/util';
import { MessageFileAttachment } from './MessageFileAttachment';
import { MessageImageAttachment } from './MessageImageAttachment';
import { MessageVideoAttachment } from './MessageVideoAttachment';
import * as classes from '@cord-sdk/react/components/MessageContent.classnames';

type Props = {
  attachments: MessageAttachment[];
};

export function MessageFilesAttachments({ attachments }: Props) {
  const [unsupportedVideoIDs, setUnsupportedVideoIDs] = useState<UUID[]>([]);

  const attachmentGroups = useMemo(() => {
    const imageFileAttachments: MessageFileAttachmentType[] = [];
    const videoFileAttachments: MessageFileAttachmentType[] = [];
    const documentFileAttachments: MessageFileAttachmentType[] = [];

    attachments.forEach((attachment) => {
      if (attachment.type !== 'file' || !attachment) {
        return;
      }

      if (isInlineDisplayableImage(attachment)) {
        imageFileAttachments.push(attachment);
      } else if (
        isInlineDisplayableVideo(attachment) &&
        !unsupportedVideoIDs.includes(attachment.id)
      ) {
        videoFileAttachments.push(attachment);
      } else {
        documentFileAttachments.push(attachment);
      }
    });

    return {
      imageFileAttachments,
      videoFileAttachments,
      documentFileAttachments,
    };
  }, [attachments, unsupportedVideoIDs]);

  const onUnsupportedFormat = useCallback((id: UUID) => {
    setUnsupportedVideoIDs((old) => [...old, id]);
  }, []);

  const imageFiles = useMemo(
    () => attachmentGroups.imageFileAttachments.filter(isNotNull),
    [attachmentGroups.imageFileAttachments],
  );
  const videoFiles = useMemo(
    () => attachmentGroups.videoFileAttachments.filter(isNotNull),
    [attachmentGroups.videoFileAttachments],
  );

  return (
    <>
      <div
        className={cx(
          classes.messageImageAttachments,
          classes.messageAttachment,
        )}
      >
        {imageFiles.map((file, index) => (
          <MessageImageAttachment
            key={index}
            file={file}
            // TODO: showMediaModal instead
            onClick={() => {}}
          />
        ))}
      </div>
      <div
        className={cx(
          classes.messageVideoAttachments,
          classes.messageAttachment,
        )}
      >
        {videoFiles.map((attachment) => (
          <MessageVideoAttachment
            key={attachment.id}
            file={attachment}
            onUnsupportedFormat={onUnsupportedFormat}
          />
        ))}
      </div>
      <div
        className={cx(
          classes.messageDocumentAttachments,
          classes.messageAttachment,
        )}
      >
        {attachmentGroups.documentFileAttachments.map((attachment, index) => (
          <MessageFileAttachment key={index} file={attachment} />
        ))}
      </div>
    </>
  );
}
