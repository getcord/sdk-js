import React, { useCallback, useRef } from 'react';
import type { UploadedFile } from '@cord-sdk/types';
import cx from 'classnames';
import { ReactEditor } from 'slate-react';
import { Button } from '../../experimental/components/helpers/Button.js';
import {
  colorsTertiary,
  medium,
} from '../../components/helpers/Button.classnames.js';
import type { CustomEditor } from '../../slateCustom.js';
import { useToast } from '../../experimental/hooks/useToast.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { useUploadFileToCord } from './hooks/useUploadFileToCord.js';

export const AddAttachmentsButton = ({
  editAttachment,
  editor,
}: {
  editAttachment: (attachment: Partial<UploadedFile>) => void;
  editor: CustomEditor;
}) => {
  const attachFileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useCordTranslation('composer');

  const handleSelectAttachment = useCallback(() => {
    attachFileInputRef.current?.click();
  }, []);

  const attachFiles = useUploadFileToCord(editAttachment);
  const { showToastPopup } = useToast();

  return (
    <>
      <Button
        canBeReplaced
        buttonAction="add-attachment"
        icon="Paperclip"
        className={cx(colorsTertiary, medium)}
        onClick={() => {
          handleSelectAttachment();
          ReactEditor.focus(editor);
        }}
      />
      <input
        ref={attachFileInputRef}
        type="file"
        accept="audio/*,
                video/*,
                image/*,
                .csv,.txt,
                .pdf,application/pdf,
                .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                .ppt,.pptx,.potx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,
                .xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                "
        multiple
        style={{ display: 'none' }}
        onClick={(event) => event.stopPropagation()}
        onChange={(e) => {
          const inputElement = e.target;
          if (inputElement.files) {
            void attachFiles(inputElement.files).then(
              () => (inputElement.value = ''),
              (error) => {
                const toastID = 'attach_file_action_failure';
                showToastPopup?.(
                  toastID,
                  t(toastID, {
                    message: error.message,
                  }),
                  'error',
                );
              },
            );
          }
        }}
      />
    </>
  );
};
