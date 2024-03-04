import * as React from 'react';
import type { HTMLProps } from 'react';
import isHotkey from 'is-hotkey';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import cx from 'classnames';
import type { Descendant } from 'slate';
import { createEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
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
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { Keys } from '../../common/const/Keys.js';

import { ComposerFileAttachments } from '../../components/composer/ComposerFileAttachments.js';
import { useMentionList } from '../../experimental/components/composer/MentionList.js';
import { WithPopper } from '../../experimental/components/helpers/WithPopper.js';
import type { CustomEditor } from '../../slateCustom.js';
import { withQuotes } from './plugins/quotes.js';
import { withBullets } from './plugins/bullets.js';
import { withHTMLPaste } from './plugins/paste.js';
import { renderElement, renderLeaf } from './lib/render.js';
import { onSpace } from './event-handlers/onSpace.js';
import { onInlineModifier } from './event-handlers/onInlineModifier.js';
import { onDeleteOrBackspace } from './event-handlers/onDeleteOrBackspace.js';
import { onArrow } from './event-handlers/onArrowPress.js';
import { onTab } from './event-handlers/onTab.js';
import { onShiftEnter } from './event-handlers/onShiftEnter.js';
import { EditorCommands, HOTKEYS } from './lib/commands.js';
import {
  createComposerEmptyValue,
  editableStyle,
  hasComposerOnlyWhiteSpaces,
  isComposerEmpty,
} from './lib/util.js';
import { withEmojis } from './plugins/withEmojis.js';
import { withUserReferences } from './lib/userReferences.js';
import { AddAttachmentsButton } from './AddAttachments.js';
import { useAttachments } from './useAttachments.js';
import { useUploadFileToCord } from './useUploadFileToCord.js';

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

/*
 * Convenience hook to add onBeforeSubmit and onAfterSubmit to the onSubmit
 */
export function useOnBeforeAfterSubmit({
  onBeforeSubmit,
  onAfterSubmit,
  onSubmit,
  ...rest
}: {
  onSubmit: (message: MessageContent) => void;
  onBeforeSubmit?: (message: MessageContent) => MessageContent;
  onAfterSubmit?: (message: MessageContent) => void;
}) {
  const onSubmitWithBeforeAfter = useCallback(
    (message: MessageContent) => {
      const newMessage = onBeforeSubmit?.(message) ?? message;
      onSubmit(newMessage);
      onAfterSubmit?.(newMessage);
    },
    [onBeforeSubmit, onAfterSubmit, onSubmit],
  );
  return { ...rest, onSubmit: onSubmitWithBeforeAfter };
}
//
// Wrapper SendComposer, internally call useSendComposer
// Wrapper EditComposer, intermally call useEditComposer

export type ComposerProps = {
  // value: MessageContent;
  onSubmit: (
    message: MessageContent,
    // attachments: unknown[],
    // metadata: object,
    // reactions: string[],
    // whatelse: unknown,
  ) => void;
  onCancel: () => void;
  onChange: (message: MessageContent) => void;
  editor: CustomEditor;
  initialValue?: MessageContent;
  isEmpty: boolean;
  isValid: boolean;
  placeholder?: string;
  attachments: UploadedFile[];
  upsertAttachment: (attachment: Partial<UploadedFile>) => void;
  removeAttachment: (attachmentID: string) => void;
  onPaste: (e: React.ClipboardEvent) => void;
};

type UseComposerProps = {
  onSubmit?: (message: MessageContent) => void;
  onCancel?: () => void;
  onChange?: (message: MessageContent) => void;
  onResetState?: () => void;
  initialValue?: MessageContent;
  placeholder?: string;
  isAlreadyValid: boolean; // TODO rename
};

type UseComposerWithAttachmentsProps = Omit<
  UseComposerProps,
  'onSubmit' | 'isAlreadyValid'
> & {
  onSubmit?: (message: MessageContent, attachments: UploadedFile[]) => void;
};

export function useEditComposer(props: EditComposerProps) {
  const { threadId, messageId } = props;
  const { sdk: cord } = useContext(CordContext);
  const onSubmit = useCallback(
    (content: MessageNode[]) => {
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
    (content: MessageNode[], attachments: UploadedFile[]) => {
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
  const simpleComposer = useComposer({
    ...rest,
    onSubmit: (message) => {
      onSubmit?.(message, attachments);
    },
    onResetState: () => {
      props.onResetState?.();
      resetAttachments();
    },
    isAlreadyValid: attachments.length > 0,
  });
  const attachFiles = useUploadFileToCord(upsertAttachment);

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const { files } = e.clipboardData;
      const allFilesAreImages =
        files &&
        files.length > 0 &&
        [...files].every((file) => {
          const [mime] = file.type.split('/');
          return mime === 'image';
        });
      if (allFilesAreImages) {
        e.stopPropagation();
        attachFiles(files).catch(console.warn);
      }
    },
    [attachFiles],
  );

  return {
    ...simpleComposer,
    onPaste,
    attachments,
    removeAttachment,
    upsertAttachment,
  };
}

/*
 * Hooks that create state and logic for simple composer that only deals with message content.
 */
function useComposer(props: UseComposerProps) {
  const {
    initialValue,
    onSubmit,
    onResetState,
    isAlreadyValid,
    onChange: onChangeProp,
    ...rest
  } = props;
  const [{ isValid, isEmpty }, updateComposerState] =
    useComposerState(isAlreadyValid);

  // TODO maybe should be a prop
  const [editor] = useState(() =>
    withHTMLPaste(
      withBullets(
        withQuotes(
          withUserReferences(
            withEmojis(withReact(withHistory(createEditor()))),
          ),
        ),
      ),
    ),
  );

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
  // This is the documented way of making Slate a controlled
  // component, see https://github.com/ianstormtaylor/slate/issues/4612#issuecomment-1348310378
  useEffect(() => {
    if (initialValue) {
      editor.children = initialValue;
      editor.onChange();
    }
  }, [editor, initialValue]);

  const handleResetState = useCallback(() => {
    onResetState?.();
    resetComposerValue();
  }, [resetComposerValue, onResetState]);

  const handleSubmitMessage = useCallback(
    (overrideMessage?: MessageNode[]) => {
      if (!isValid) {
        return;
      }

      onSubmit?.(overrideMessage ?? editor.children);
      handleResetState();
    },
    [editor.children, onSubmit, isValid, handleResetState],
  );

  const onChange = useCallback(
    (newValue: MessageContent) => {
      const empty = !newValue.length;
      if (empty) {
        EditorCommands.addParagraph(editor, [0]);
      }
      // Update user references when value OR selection changes
      // TODO mention, somewhere else
      // mentionList.updateUserReferences();
      // [ONI]-TODO
      // updateTyping(Node.string(editor).length > 0);
      updateComposerState(newValue);
      onChangeProp?.(newValue);
    },
    [editor, onChangeProp, updateComposerState],
  );
  return {
    onSubmit: handleSubmitMessage,
    onChange,
    onCancel: () => {}, // TODO fix typing
    editor,
    isEmpty,
    initialValue,
    isValid,
    ...rest,
  }; //satisfies ComposerProps; TODO FIX
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
    onChange,
    isEmpty,
    initialValue,
    isValid,
    attachments,
    removeAttachment,
    upsertAttachment,
    onPaste,
  }: ComposerProps) {
    const { t } = useCordTranslation('composer');

    // TODO deal with this
    const mentionList = useMentionList({
      editor,
    });

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

        const handled = mentionList.handleKeyDown(event);
        if (handled) {
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
            // TODO value or editor childrern
            onSubmit(editor.children);
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
      [editor, onSubmit, mentionList],
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
            initialValue={initialValue ?? createComposerEmptyValue()}
            onChange={onChange}
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
              onPaste={onPaste}
            />
            {/* [ONI]-TODO Add custom placeholder */}
          </Slate>
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
                onClick={() => onSubmit(editor.children)}
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

type ComposerState = { isEmpty: boolean; isValid: boolean };
function useComposerState(
  isAlreadyValid: boolean,
): [ComposerState, (newValue: Descendant[]) => void] {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const updateState = useCallback((newValue: Descendant[]) => {
    const composerEmpty = isComposerEmpty(newValue);
    setIsEmpty(composerEmpty);
    const composerHasOnlyWhiteSpaces = hasComposerOnlyWhiteSpaces(newValue);
    setIsValid(!composerEmpty && !composerHasOnlyWhiteSpaces);
  }, []);

  return [{ isEmpty, isValid: isValid || isAlreadyValid }, updateState];
}
