import * as React from 'react';
import type { UploadedFile } from '@cord-sdk/types';
import { FileAttachment } from '../composer/FileAttachment';
import { useCordTranslation } from '@cord-sdk/react';
import * as classes from '@cord-sdk/react/components/message/MessageFileAttachment.classnames';

type Props = {
  file: UploadedFile;
};

export function MessageFileAttachment({ file }: Props) {
  const { t } = useCordTranslation('message');
  const { name, mimeType, size, url } = file;
  const uploadState = file.uploadStatus;
  const showErrorState =
    uploadState === 'failed' ||
    uploadState === 'cancelled' ||
    // Author has optimistically-inserted dataURI right after posting a message
    (uploadState === 'uploading' && !url.startsWith('data:'));

  return (
    <FileAttachment
      className={classes.documentAttachment}
      mimeType={mimeType}
      fileName={name}
      fileSize={size}
      uploading={uploadState === 'uploading'}
      showErrorState={showErrorState}
      url={url}
      actionLabel={t('download_action')}
    />
  );
}
