import * as React from 'react';

import type { UUID, UploadedFile } from '@cord-sdk/types';
import classes from './ComposerFileAttachments.css.ts';
import { ComposerFileAttachment } from './ComposerFileAttachment.tsx';

export function ComposerFileAttachments({
  attachments,
  onRemoveAttachment,
}: {
  attachments: UploadedFile[];
  onRemoveAttachment: (id: UUID) => void;
}) {
  return (
    <div className={classes.attachmentsContainer}>
      {attachments.map((attachment) => (
        <ComposerFileAttachment
          attachment={attachment}
          onFileRemoved={onRemoveAttachment}
          key={attachment.id}
        />
      ))}
    </div>
  );
}
