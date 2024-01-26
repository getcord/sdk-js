import * as React from 'react';
import type { UUID, UploadedFile } from '@cord-sdk/types';
import { FileAttachment } from '../../experimental/components/composer/FileAttachment.tsx';
import { ImageAttachment } from '../../experimental/components/composer/ImageAttachment.tsx';
import { useCordTranslation } from '@cord-sdk/react';
import { isInlineDisplayableImage } from '@cord-sdk/react/common/lib/uploads.ts';
import { Icon } from '@cord-sdk/react/components/helpers/Icon.tsx';

type Props = {
  attachment: UploadedFile;
  onFileRemoved: (id: UUID) => void;
};

export function ComposerFileAttachment({ attachment, onFileRemoved }: Props) {
  const { t } = useCordTranslation('composer');
  const { id, name, mimeType, url, uploadStatus, size } = attachment;

  const uploading = uploadStatus === 'uploading';

  if (isInlineDisplayableImage(mimeType)) {
    return (
      <ImageAttachment
        url={url}
        uploading={uploading}
        onClick={() => onFileRemoved(id)}
        tooltipLabel={t('remove_file_action')}
        onHoverElement={<Icon name="X" size="large" />}
      />
    );
  }

  return (
    <FileAttachment
      mimeType={mimeType}
      fileName={name}
      uploading={uploading}
      onButtonClick={() => onFileRemoved(id)}
      actionLabel={t('remove_file_action')}
      fileSize={size}
    />
  );
}
