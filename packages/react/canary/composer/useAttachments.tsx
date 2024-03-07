import type { UploadedFile } from '@cord-sdk/types';
import { useCallback, useState } from 'react';

export function useAttachments(initialAttachments?: UploadedFile[]) {
  const [attachments, setAttachments] = useState<UploadedFile[]>(
    initialAttachments ?? [],
  );

  const upsertAttachment = useCallback(
    (attachment: Partial<UploadedFile>) => {
      setAttachments((prev) => {
        return (
          updateAttachment(prev, attachment) ?? [
            ...prev,
            attachment as UploadedFile,
          ]
        );
      });
    },
    [setAttachments],
  );

  const removeAttachment = useCallback(
    (attachmentID: string) => {
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentID));
    },
    [setAttachments],
  );

  const resetAttachments = useCallback(() => {
    setAttachments([]);
  }, [setAttachments]);

  return {
    attachments,
    upsertAttachment,
    removeAttachment,
    resetAttachments,
    initialAttachments,
  };
}

function updateAttachment(
  attachments: UploadedFile[],
  attachment: Partial<UploadedFile>,
): UploadedFile[] | null {
  const newAttachments = [...attachments];
  // ONI-TODO:This is wrong. An already uploaded image may have the same name.
  const uploadedFile = newAttachments.find((a) => a.name === attachment.name);
  if (!uploadedFile) {
    return null;
  }
  uploadedFile.uploadStatus = attachment.uploadStatus!;

  if (attachment.url) {
    uploadedFile.url = attachment.url;
  }

  return newAttachments;
}
