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
import { ComposerLayout } from './ComposerLayout.js';

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
  initialAttachments?: UploadedFile[];
  onSubmit?: (e: {
    content: MessageContent;
    attachments: UploadedFile[];
  }) => void;
};

export function useEditSubmit(
  messageId: string,
  threadId: string,
  initialAttachments?: UploadedFile[],
) {
  const { sdk: cord } = useContext(CordContext);
  const onSubmit = useCallback(
    ({
      content,
      attachments,
    }: {
      content: MessageNode[];
      attachments: UploadedFile[];
    }) => {
      const oldAttachmentIDs = new Set(initialAttachments?.map((a) => a.id));
      const newAttachmentIDs = new Set(attachments?.map((a) => a.id));
      void cord?.thread.updateMessage(threadId, messageId, {
        content,
        addAttachments: attachments
          .filter((a) => !oldAttachmentIDs.has(a.id))
          .map((a) => ({ id: a.id, type: 'file' })),
        removeAttachments:
          initialAttachments
            ?.filter((a) => !newAttachmentIDs.has(a.id))
            .map((a) => ({ id: a.id, type: 'file' })) ?? [],
      });
    },
    [cord?.thread, messageId, threadId, initialAttachments],
  );
  return onSubmit;
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

export function useComposerWithAttachments(
  props: UseComposerWithAttachmentsProps,
) {
  const { initialAttachments } = props;
  const { attachments, upsertAttachment, removeAttachment, resetAttachments } =
    useAttachments(initialAttachments); // TODO what happens on edit?

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
    initialAttachments,
    removeAttachment,
    upsertAttachment,
  };
}

export const Composer = (props: SendComposerProps) => {
  return <RawComposer canBeReplaced {...useSendComposer(props)} />;
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
    const handleKeyDownAndMention = useCallback(
      (args: Parameters<typeof onKeyDown>[0]) => {
        if (mentionList.handleKeyDown(args.event)) {
          return;
        }
        onKeyDown(args);
      },
      [mentionList, onKeyDown],
    );
    const onChangeWithMention = useCallback(
      (args: Parameters<typeof onChange>[0]) => {
        mentionList.updateUserReferences();
        onChange(args);
      },
      [mentionList, onChange],
    );

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
        <ComposerLayout
          canBeReplaced
          textEditor={
            <TextEditor
              canBeReplaced
              className="cord-editor"
              placeholder={placeholder}
              editor={mentionList.editor}
              initialValue={initialValue}
              onPaste={onPaste}
              onChange={onChangeWithMention}
              onSubmit={onSubmit}
              onKeyDown={handleKeyDownAndMention}
            />
          }
          attachments={
            attachments.length > 0 ? (
              <ComposerFileAttachments
                attachments={attachments}
                onRemoveAttachment={removeAttachment}
              />
            ) : null
          }
          addMention={
            <Button
              buttonAction="add-mention"
              className={cx(colorsTertiary, medium)}
              icon="At"
              onClick={handleAddAtCharacter}
              disabled={mentionList.isOpen}
            />
          }
          addAttachment={
            <AddAttachmentsButton
              editor={editor}
              editAttachment={upsertAttachment}
            />
          }
          sendButton={
            <SendButton
              onClick={() => onSubmit({ content: editor.children })}
              canBeReplaced
              disabled={!isValid}
            />
          }
          cancelButton={null}
        />
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
