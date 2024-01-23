import * as React from 'react';
import type { HTMLProps } from 'react';
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
import { v4 as uuid } from 'uuid';
import type { ClientCreateThread, MessageContent } from '@cord-sdk/types';
import { MessageNodeType } from '@cord-sdk/types';
import { CordContext } from '../../contexts/CordContext.tsx';
import { Button } from '../../experimental/components/helpers/Button.tsx';
import {
  colorsPrimary,
  colorsTertiary,
  medium,
  sendButton,
  small,
} from '../../components/helpers/Button.classnames.ts';
import withCord from '../../experimental/components/hoc/withCord.ts';
import { isEqual } from '../../common/lib/fast-deep-equal.ts';
import { createMessageNode } from '../../common/lib/messageNode.tsx';
import { useCordTranslation } from '../../hooks/useCordTranslation.tsx';

// Important not to use this value directly, as Slate gets confused two
// editors have the same value by reference. This can lead to a bug where
// onChange fires for multiple editors
const COMPOSER_EMPTY_VALUE_FOR_COMPARING = createComposerEmptyValue();
export function createComposerEmptyValue() {
  return [
    createMessageNode(MessageNodeType.PARAGRAPH, {
      children: [{ text: '' }],
    }),
  ];
}
export function isComposerEmpty(value: MessageContent) {
  return (
    isEqual(value, COMPOSER_EMPTY_VALUE_FOR_COMPARING) || isEqual(value, [])
  );
}
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
    const [editor] = useState(() => withReact(createEditor()));
    const [attachmentsIDs, setAttachmentsIDs] = useState<string[]>([]);
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
      setAttachmentsIDs([]);
      resetComposerValue();
    }, [resetComposerValue]);

    const handleSendMessage = useCallback(() => {
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        content: editor.children,
        addAttachments: attachmentsIDs.map((id) => ({ id, type: 'file' })),
        createThread: createThread ?? {
          location: { location: url },
          url,
          name: document.title,
        },
      });
      handleResetState();
    }, [
      cord?.thread,
      threadId,
      editor.children,
      attachmentsIDs,
      createThread,
      handleResetState,
    ]);

    const attachFiles = useCallback(
      async (files: FileList) => {
        const promises = [];
        for (const file of files) {
          promises.push(
            cord!.file.uploadFile({
              name: file.name,
              blob: file,
            }),
          );
        }
        void Promise.all(promises).then((newFiles) => {
          setAttachmentsIDs((prev) => [...prev, ...newFiles.map((f) => f.id)]);
        });
      },
      [cord],
    );

    const handleSelectAttachment = useCallback(() => {
      attachFileInputRef.current?.click();
    }, []);

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
            placeholder={placeholder ?? t('send_message_placeholder')}
            style={{
              outline: 'none',
              // TODO Properly style this.
              padding: '0 8px 16px',
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
                );
              }
            }}
          />
        </Slate>
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
