import * as React from 'react';
import type { HTMLProps } from 'react';
import isHotkey from 'is-hotkey';
import { forwardRef, useCallback, useContext } from 'react';
import cx from 'classnames';
import { ReactEditor } from 'slate-react';
import { v4 as uuid } from 'uuid';
import type {
  ClientCreateThread,
  MessageContent,
  MessageNode,
  UploadedFile,
} from '@cord-sdk/types';
import { CordContext } from '../../contexts/CordContext.js';
import { Button } from '../../experimental/components/helpers/Button.js';
import {
  colorsPrimary,
  colorsTertiary,
  medium,
  sendButton,
  small,
} from '../../components/helpers/Button.classnames.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import { Keys } from '../../common/const/Keys.js';

import { ComposerFileAttachments } from '../../components/composer/ComposerFileAttachments.js';
import { useMentionList } from '../../experimental/components/composer/MentionList.js';
import { WithPopper } from '../../experimental/components/helpers/WithPopper.js';
import type { CustomEditor } from '../../slateCustom.js';
import { onSpace } from './event-handlers/onSpace.js';
import { onInlineModifier } from './event-handlers/onInlineModifier.js';
import { onDeleteOrBackspace } from './event-handlers/onDeleteOrBackspace.js';
import { onArrow } from './event-handlers/onArrowPress.js';
import { onTab } from './event-handlers/onTab.js';
import { onShiftEnter } from './event-handlers/onShiftEnter.js';
import { EditorCommands, HOTKEYS } from './lib/commands.js';
import { AddAttachmentsButton } from './AddAttachments.js';
import { useAttachments } from './useAttachments.js';
import { useUploadFileToCord } from './useUploadFileToCord.js';
import { TextEditor, useTextEditor } from './TextEditor.js';
import type { UseTextEditorProps } from './TextEditor.js';

export type SendComposerProps = {
  initialValue?: MessageContent;
  threadId?: string;
  createThread?: ClientCreateThread;
  placeholder?: string;
};

export type EditComposerProps = {
  initialValue?: MessageContent;
  threadId: string;
  messageId: string;
  placeholder?: string;
};

export type ComposerProps = {
  onSubmit: (arg: { content: MessageContent }) => void;
  onCancel: () => void;
  onChange: (event: { content: MessageContent }) => void;
  onKeyDown: (event: {
    event: React.KeyboardEvent;
    onSubmit?: (arg: { content: MessageContent }) => void;
  }) => void;
  editor: CustomEditor;
  initialValue?: MessageContent;
  isEmpty: boolean;
  isValid: boolean;
  placeholder?: string;
  attachments: UploadedFile[];
  upsertAttachment: (attachment: Partial<UploadedFile>) => void;
  removeAttachment: (attachmentID: string) => void;
  onPaste: (e: { event: React.ClipboardEvent }) => void;
};

type UseComposerWithAttachmentsProps = Omit<
  UseTextEditorProps,
  'onSubmit' | 'isAlreadyValid'
> & {
  onSubmit?: (e: {
    content: MessageContent;
    attachments: UploadedFile[];
  }) => void;
};

export function useEditComposer(props: EditComposerProps) {
  const { threadId, messageId } = props;
  const { sdk: cord } = useContext(CordContext);
  const onSubmit = useCallback(
    ({ content }: { content: MessageNode[]; attachments: UploadedFile[] }) => {
      void cord?.thread.updateMessage(threadId, messageId, {
        content,
        // TODO deal with attachments
        // addAttachments: attachments.map((a) => ({ id: a.id, type: 'file' })),
      });
    },
    [cord?.thread, messageId, threadId],
  );
  return useComposerWithAttachments({ ...props, onSubmit });
}

function useSendComposer(props: SendComposerProps) {
  const { threadId, createThread } = props;
  const { sdk: cord } = useContext(CordContext);
  const onSubmit = useCallback(
    ({
      content,
      attachments,
    }: {
      content: MessageNode[];
      attachments: UploadedFile[];
    }) => {
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        content,
        addAttachments: attachments.map((a) => ({ id: a.id, type: 'file' })),
        createThread: createThread ?? {
          location: { location: url },
          url,
          name: document.title,
        },
      });
    },
    [cord?.thread, createThread, threadId],
  );
  return useComposerWithAttachments({ ...props, onSubmit });
}

function useComposerWithAttachments(props: UseComposerWithAttachmentsProps) {
  const { attachments, upsertAttachment, removeAttachment, resetAttachments } =
    useAttachments(); // TODO what happens on edit?

  const { onSubmit, ...rest } = props;
  const simpleComposer = useTextEditor({
    ...rest,
    onSubmit: ({ content }) => {
      onSubmit?.({ content, attachments });
    },
    onResetState: () => {
      props.onResetState?.();
      resetAttachments();
    },
    isValid: (isTextValid: boolean) => isTextValid || attachments.length > 0,
  });
  const { editor } = simpleComposer;
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

  const onTextSubmit = simpleComposer.onSubmit;
  const onKeyDown = useCallback(
    ({
      event,
      onSubmitOverride,
    }: {
      event: React.KeyboardEvent;
      onSubmitOverride?: ({ content }: { content: MessageContent }) => void;
    }) => {
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
          (onSubmitOverride ?? onTextSubmit)({ content: editor.children });
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
    [editor, onTextSubmit],
  );

  return {
    ...simpleComposer,
    onPaste,
    onKeyDown,
    attachments,
    removeAttachment,
    upsertAttachment,
  };
}

export const Composer = (props: SendComposerProps) => {
  return <RawComposer canBeReplaced {...useSendComposer(props)} />;
};
export const EditComposer = (_props: EditComposerProps) => {
  return <div></div>;
  // return <RawComposer canBeReplaced {...useEditComposer(props)} />;
};

export const RawComposer = withCord<React.PropsWithChildren<ComposerProps>>(
  forwardRef(function RawComposer({
    placeholder,
    editor,
    onSubmit,
    onKeyDown,
    onChange,
    isEmpty,
    initialValue,
    isValid,
    attachments,
    removeAttachment,
    upsertAttachment,
    onPaste,
  }: ComposerProps) {
    // TODO deal with this
    const mentionList = useMentionList({
      editor,
    });

    const handleAddAtCharacter = useCallback(() => {
      EditorCommands.addText(editor, editor.selection, isEmpty ? '@' : ' @');
    }, [isEmpty, editor]);

    return (
      <WithPopper
        popperElement={mentionList.Component}
        popperElementVisible={mentionList.isOpen}
        popperPosition="top-start"
        onShouldHide={mentionList.close}
        popperWidth="full"
      >
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
          <TextEditor
            canBeReplaced
            className="cord-editor"
            placeholder={placeholder}
            editor={editor}
            initialValue={initialValue}
            onPaste={onPaste}
            onChange={onChange}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
          />
          {attachments.length > 0 && (
            <ComposerFileAttachments
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
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
                buttonAction="add-mention"
                className={cx(colorsTertiary, medium)}
                icon="At"
                onClick={handleAddAtCharacter}
                disabled={mentionList.isOpen}
              />
              <AddAttachmentsButton
                editor={editor}
                editAttachment={upsertAttachment}
              />
            </div>
            <div className="cord-composer-primary-buttons">
              <SendButton
                onClick={() => onSubmit({ content: editor.children })}
                canBeReplaced
                disabled={!isValid}
              />
            </div>
          </div>
        </div>
      </WithPopper>
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
