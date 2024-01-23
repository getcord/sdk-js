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
import type { ClientCreateThread, MessageContent } from '@cord-sdk/types';
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
        withBullets(withQuotes(withReact(withHistory(createEditor())))),
      ),
    );
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
      editor.children,
      cord?.thread,
      threadId,
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
            // className="cord-editor"
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
