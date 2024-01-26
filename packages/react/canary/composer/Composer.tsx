import * as React from 'react';
import type { HTMLProps } from 'react';
import isHotkey from 'is-hotkey';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { createEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { v4 as uuid } from 'uuid';
import type {
  ClientCreateThread,
  MessageContent,
  UploadedFile,
} from '@cord-sdk/types';
import { CordContext } from '../../contexts/CordContext.tsx';
import { Button } from '../../experimental/components/helpers/Button.tsx';
import {
  colorsPrimary,
  colorsTertiary,
  medium,
  sendButton,
  small,
} from '../../components/helpers/Button.classnames.ts';
import withCord from '../../experimental/components/hoc/withCord.tsx';
import { useCordTranslation } from '../../hooks/useCordTranslation.tsx';
import { Keys } from '../../common/const/Keys.ts';

import { ComposerFileAttachments } from '../../components/composer/ComposerFileAttachments.tsx';
import { readFileAsync } from '../../common/lib/uploads.ts';
import { withQuotes } from './plugins/quotes.ts';
import { withBullets } from './plugins/bullets.ts';
import { withHTMLPaste } from './plugins/paste.ts';
import { renderElement, renderLeaf } from './lib/render.tsx';
import { onSpace } from './event-handlers/onSpace.ts';
import { onInlineModifier } from './event-handlers/onInlineModifier.ts';
import { onDeleteOrBackspace } from './event-handlers/onDeleteOrBackspace.ts';
import { onArrow } from './event-handlers/onArrowPress.ts';
import { onTab } from './event-handlers/onTab.ts';
import { onShiftEnter } from './event-handlers/onShiftEnter.ts';
import { EditorCommands, HOTKEYS } from './lib/commands.ts';
import { createComposerEmptyValue, editableStyle } from './lib/util.ts';
import { withEmojis } from './plugins/withEmojis.ts';

export type ComposerProps = {
  value?: MessageContent;
  threadId?: string;
  createThread?: ClientCreateThread;
  placeholder?: string;
};

export const Composer = withCord<React.PropsWithChildren<ComposerProps>>(
  forwardRef(function Composer({
    threadId,
    createThread,
    value,
    placeholder,
  }: ComposerProps) {
    const { t } = useCordTranslation('composer');
    const [editor] = useState(() =>
      withHTMLPaste(
        withBullets(
          withQuotes(withEmojis(withReact(withHistory(createEditor())))),
        ),
      ),
    );
    const [attachments, setAttachments] = useState<UploadedFile[]>([]);
    const { sdk: cord } = useContext(CordContext);
    const attachFileInputRef = useRef<HTMLInputElement>(null);

    // This is the documented way of making Slate a controlled
    // component, see https://github.com/ianstormtaylor/slate/issues/4612#issuecomment-1348310378
    useEffect(() => {
      if (value) {
        editor.children = value;
        editor.onChange();
      }
    }, [editor, value]);

    const resetComposerValue = useCallback(
      (newValue?: MessageContent) => {
        const point = { path: [0, 0], offset: 0 };
        editor.selection = { anchor: point, focus: point };
        editor.history = { redos: [], undos: [] };
        editor.children = newValue?.length
          ? newValue
          : createComposerEmptyValue();
      },
      [editor],
    );

    const handleResetState = useCallback(() => {
      setAttachments([]);
      resetComposerValue();
    }, [resetComposerValue]);

    const handleSendMessage = useCallback(() => {
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        content: editor.children,
        addAttachments: attachments.map((a) => ({ id: a.id, type: 'file' })),
        createThread: createThread ?? {
          location: { location: url },
          url,
          name: document.title,
        },
      });
      handleResetState();
    }, [
      editor.children,
      cord?.thread,
      threadId,
      attachments,
      createThread,
      handleResetState,
    ]);

    const attachFiles = useCallback(
      async (files: FileList) => {
        const uploadedFiles: UploadedFile[] = [];
        for (const file of files) {
          const { id, uploadPromise } = await cord!.file.uploadFile({
            name: file.name,
            blob: file,
          });

          // Let's not wait for the file to be uploaded
          // before showing something in the UI.
          // Some time in the future, we'll update the `uploadedState`
          void uploadPromise.then(
            () =>
              setAttachments((prev) =>
                updateAttachment(prev, file.name, { uploadStatus: 'uploaded' }),
              ),
            () =>
              setAttachments((prev) =>
                updateAttachment(prev, file.name, { uploadStatus: 'failed' }),
              ),
          );

          // Before we have the URL to the resource, we can still
          // show a preview by passing the dataURL to the `img`
          const dataURL = await readFileAsync(file);
          uploadedFiles.push({
            id,
            name: file.name,
            url: dataURL,
            mimeType: file.type,
            size: file.size,
            uploadStatus: 'uploading',
          });
        }
        setAttachments((prev) => [...prev, ...uploadedFiles]);
      },
      [cord],
    );

    const handleRemoveAttachment = useCallback((attachmentID: string) => {
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentID));
    }, []);

    const handleSelectAttachment = useCallback(() => {
      attachFileInputRef.current?.click();
    }, []);

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        for (const hotkey in HOTKEYS) {
          if (isHotkey.default(hotkey, event)) {
            event.preventDefault();
            const mark = HOTKEYS[hotkey];
            EditorCommands.toggleMark(editor, mark);
            return;
          }
        }

        // Debug dump
        if (isHotkey.default('ctrl+shift+d', event as any)) {
          event.preventDefault();
          // eslint-disable-next-line no-console
          console.log('Editor content:', editor.children);
          return;
        }

        if (event.key === Keys.SPACEBAR) {
          onSpace(editor, event);
          return;
        }

        if (
          event.key === Keys.BACKTICK ||
          event.key === Keys.ASTERISK ||
          event.key === Keys.UNDERSCORE
        ) {
          onInlineModifier(editor, event);
          return;
        }

        if (event.key === Keys.BACKSPACE || event.key === Keys.DELETE) {
          onDeleteOrBackspace(editor, event);
          return;
        }

        if (
          !event.shiftKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          (event.key === Keys.ARROW_UP ||
            event.key === Keys.ARROW_DOWN ||
            event.key === Keys.ARROW_LEFT ||
            event.key === Keys.ARROW_RIGHT)
        ) {
          onArrow(editor, event);
          return;
        }

        if (event.key === Keys.ENTER) {
          if (event.shiftKey) {
            onShiftEnter(editor, event);
            return;
          } else {
            event.preventDefault();
            handleSendMessage();
          }
        }

        if (event.key === Keys.TAB) {
          onTab(editor, event);
        }

        if (event.key === Keys.ESCAPE) {
          ReactEditor.blur(editor);
          // [ONI]-TODO handle stop editing
        }
      },
      [editor, handleSendMessage],
    );

    // Attach pasted images
    const handlePaste = useCallback(
      (e: React.ClipboardEvent) => {
        const { files } = e.clipboardData;

        if (
          files &&
          files.length > 0 &&
          [...files].every((file) => {
            const [mime] = file.type.split('/');
            return mime === 'image';
          })
        ) {
          e.stopPropagation();
          attachFiles(files).catch(console.warn);
        }
      },
      [attachFiles],
    );

    return (
      <div
        className="cord-component cord-composer"
        style={{
          backgroundColor: 'var(--cord-color-base, #FFFFFF)',
          border:
            'var(--cord-composer-border, 1px solid var(--cord-color-base-x-strong, #DADCE0))',
          borderRadius:
            'var(--cord-composer-border-radius, var(--cord-border-radius-medium, var(--cord-space-3xs, 4px)))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Slate
          editor={editor}
          initialValue={value ?? createComposerEmptyValue()}
        >
          <Editable
            className="cord-editor"
            placeholder={placeholder ?? t('send_message_placeholder')}
            style={{
              outline: 'none',
              // [ONI]-TODO Properly style this.
              padding: '0 8px 16px',
              ...editableStyle,
            }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            onPaste={handlePaste}
          />
          {/* [ONI]-TODO Add custom placeholder */}
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
                );
              }
            }}
          />
        </Slate>
        {attachments.length > 0 && (
          <ComposerFileAttachments
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
        )}
        {/* Temporary cord-composer-menu. [ONI]-TODO Fix both styles and DOM structure. */}
        <div
          className="cord-composer-menu"
          style={{
            borderTop: '1px solid var(--cord-color-base-x-strong, #DADCE0)',
            padding:
              'var(--cord-space-2xs, 8px) var(--cord-space-2xs, 8px) var(--cord-space-none, 0px)',
          }}
        >
          <div className="secondary-buttons">
            <Button
              buttonAction="add-attachment"
              icon="Paperclip"
              className={cx(colorsTertiary, medium)}
              onClick={() => {
                handleSelectAttachment();
                ReactEditor.focus(editor);
              }}
            />
          </div>
          <div className="cord-composer-primary-buttons">
            <SendButton onClick={handleSendMessage} canBeReplaced />
          </div>
        </div>
      </div>
    );
  }),
  'Composer',
);

export type SendButtonProps = {
  onClick: () => void;
} & HTMLProps<HTMLButtonElement>;
export const SendButton = withCord(
  forwardRef(function SendButton(
    { onClick, className, ...restProps }: SendButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) {
    return (
      <Button
        className={cx(className, sendButton, colorsPrimary, small)}
        buttonAction="send-message"
        onClick={onClick}
        icon="ArrowRight"
        {...restProps}
        type="button"
        ref={ref}
      />
    );
  }),
  'SendButton',
);

function updateAttachment(
  attachments: UploadedFile[],
  fileName: string,
  newState: { uploadStatus: UploadedFile['uploadStatus'] },
) {
  const newAttachments = [...attachments];
  const uploadedFile = newAttachments.find((a) => a.name === fileName);
  if (uploadedFile) {
    // [ONI]-TODO this should also set the URL.
    // Update this when `uploadPromise` returns `url`.
    uploadedFile.uploadStatus = newState.uploadStatus;
  }
  return newAttachments;
}
