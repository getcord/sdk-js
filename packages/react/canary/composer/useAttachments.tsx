import * as React from 'react';
import type { MessageFileAttachment } from '@cord-sdk/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ComposerFileAttachments } from '../../components/composer/ComposerFileAttachments.js';
import type { CustomEditor } from '../../slateCustom.js';
import { AddAttachmentsButton } from './AddAttachments.js';
import { useUploadFileToCord } from './useUploadFileToCord.js';
import type { ComposerProps } from './Composer.js';

const EMPTY_ARRAY: MessageFileAttachment[] = [];

export function useAttachments(initialAttachments?: MessageFileAttachment[]) {
  const [attachments, setAttachments] = useState<MessageFileAttachment[]>(
    initialAttachments ?? [],
  );
  useEffect(() => {
    setAttachments(initialAttachments ?? EMPTY_ARRAY);
  }, [initialAttachments]);

  const upsertAttachment = useCallback(
    (attachment: Partial<MessageFileAttachment>) => {
      setAttachments((prev) => {
        return (
          updateAttachment(prev, attachment) ?? [
            ...prev,
            attachment as MessageFileAttachment,
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
    setAttachments(initialAttachments ?? []);
  }, [setAttachments, initialAttachments]);

  return {
    attachments,
    upsertAttachment,
    removeAttachment,
    resetAttachments,
    initialAttachments,
  };
}

function updateAttachment(
  attachments: MessageFileAttachment[],
  attachment: Partial<MessageFileAttachment>,
): MessageFileAttachment[] | null {
  const newAttachments = [...attachments];
  // ONI-TODO:This is wrong. An already uploaded image may have the same name.
  const uploadedFile = newAttachments.find((a) => a.name === attachment.name);
  if (!uploadedFile) {
    return null;
  }
  uploadedFile.uploadStatus = attachment.uploadStatus!;
  uploadedFile.type = 'file';

  if (attachment.url) {
    uploadedFile.url = attachment.url;
  }

  return newAttachments;
}

export function useAddAttachmentToComposer(attachmentsProps: {
  initialAttachments: MessageFileAttachment[];
  editor: CustomEditor;
}): Pick<
  ComposerProps,
  'extraChildren' | 'onPaste' | 'onResetState' | 'isValid' | 'toolbarItems'
> & {
  attachments: MessageFileAttachment[];
} {
  const { initialAttachments, editor } = attachmentsProps;
  const { attachments, upsertAttachment, removeAttachment, resetAttachments } =
    useAttachments(initialAttachments);

  const isValid = attachments.length > 0;
  const attachFiles = useUploadFileToCord(upsertAttachment);

  const onPaste = useCallback(
    ({ event }: { event: React.ClipboardEvent }) => {
      const { files } = event.clipboardData;
      const allFilesAreImages =
        files &&
        files.length > 0 &&
        [...files].every((file) => {
          const [mime] = file.type.split('/');
          return mime === 'image';
        });
      if (allFilesAreImages) {
        event.stopPropagation();
        attachFiles(files).catch(console.warn);
      }
    },
    [attachFiles],
  );

  const attachmentsElement = useMemo(
    () =>
      attachments.length > 0 ? (
        <ComposerFileAttachments
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
        />
      ) : null,
    [attachments, removeAttachment],
  );
  const extraChildren = useMemo(
    () => [{ name: 'attachments', element: attachmentsElement }],
    [attachmentsElement],
  );
  const toolbarItems = useMemo(() => {
    return [
      {
        name: 'addAttachment',
        element: (
          <AddAttachmentsButton
            editor={editor}
            editAttachment={upsertAttachment}
          />
        ),
      },
    ];
  }, [editor, upsertAttachment]);
  return useMemo(
    () => ({
      toolbarItems,
      attachments,
      extraChildren,
      onResetState: resetAttachments,
      isValid,
      onPaste,
    }),
    [
      attachments,
      extraChildren,
      toolbarItems,
      onPaste,
      isValid,
      resetAttachments,
    ],
  );
}
