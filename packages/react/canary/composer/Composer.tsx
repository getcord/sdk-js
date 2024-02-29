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
};

type UseComposerProps = {
  onSubmit?: (
    message: MessageContent,
    // attachments: unknown[],
    // metadata: object,
    // reactions: string[],
    // whatelse: unknown,
  ) => void;
  onCancel?: () => void;
  onChange?: (message: MessageContent) => void;
  initialValue?: MessageContent;
  placeholder?: string;
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
  return useComposer({ ...props, onSubmit });
}

function useSendComposer(props: SendComposerProps) {
  const { threadId, createThread } = props;
  const { sdk: cord } = useContext(CordContext);
  const onSubmit = useCallback(
    (content: MessageNode[]) => {
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        content,
        // TODO deal with attachments
        // addAttachments: attachments.map((a) => ({ id: a.id, type: 'file' })),
        createThread: createThread ?? {
          location: { location: url },
          url,
          name: document.title,
        },
      });
    },
    [cord?.thread, createThread, threadId],
  );
  return useComposer({ ...props, onSubmit });
}

/*
 * Hooks that create state and logic for simple composer that only deals with message content.
 */
function useComposer(props: UseComposerProps) {
  const { initialValue, onSubmit } = props;
  const [{ isValid, isEmpty }, updateComposerState] = useComposerState([]); // TODO deal with attachment (attachments);

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
    // TODO deal with attachments, somewhere else
    // setAttachments([]);
    resetComposerValue();
  }, [resetComposerValue]);

  const handleSubmitMessage = useCallback(() => {
    if (isEmpty || !isValid) {
      return;
    }

    onSubmit?.(editor.children);
    handleResetState();
  }, [editor.children, onSubmit, isEmpty, isValid, handleResetState]);

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
    },
    [editor, updateComposerState],
  );
  return {
    onSubmit: handleSubmitMessage,
    onChange,
    onCancel: () => {},
    editor,
    isEmpty,
    initialValue,
    isValid,
  } satisfies ComposerProps;
}

export const Composer = (props: SendComposerProps) => {
  return <RawComposer canBeReplaced {...useSendComposer(props)} />;
};
export const EditComposer = (props: EditComposerProps) => {
  return <RawComposer canBeReplaced {...useEditComposer(props)} />;
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
  }: ComposerProps) {
    const { t } = useCordTranslation('composer');
    // const [attachments, setAttachments] = useState<UploadedFile[]>([]);
    // const attachFileInputRef = useRef<HTMLInputElement>(null);

    // TODO deal with this
    const mentionList = useMentionList({
      editor,
    });

    // const attachFiles = useCallback(
    //   async (files: FileList) => {
    //     const uploadedFiles: UploadedFile[] = [];
    //     for (const file of files) {
    //       const { id, uploadPromise } = await cord!.file.uploadFile({
    //         name: file.name,
    //         blob: file,
    //       });

    //       // Let's not wait for the file to be uploaded
    //       // before showing something in the UI.
    //       // Some time in the future, we'll update the `uploadedState`
    //       void uploadPromise.then(
    //         ({ url }) =>
    //           setAttachments((prev) =>
    //             updateAttachment(prev, file.name, {
    //               uploadStatus: 'uploaded',
    //               url,
    //             }),
    //           ),
    //         () =>
    //           setAttachments((prev) =>
    //             updateAttachment(prev, file.name, { uploadStatus: 'failed' }),
    //           ),
    //       );

    //       // Before we have the URL to the resource, we can still
    //       // show a preview by passing the dataURL to the `img`
    //       const dataURL = await readFileAsync(file);
    //       uploadedFiles.push({
    //         id,
    //         name: file.name,
    //         url: dataURL,
    //         mimeType: file.type,
    //         size: file.size,
    //         uploadStatus: 'uploading',
    //       });
    //     }
    //     setAttachments((prev) => [...prev, ...uploadedFiles]);
    //   },
    //   [cord],
    // );

    // const handleRemoveAttachment = useCallback((attachmentID: string) => {
    //   setAttachments((prev) => prev.filter((a) => a.id !== attachmentID));
    // }, []);

    // const handleSelectAttachment = useCallback(() => {
    //   attachFileInputRef.current?.click();
    // }, []);

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
          // TODO attachFiles(files)
          // attachFiles(files).catch(console.warn);
        }
      },
      [
        /*attachFiles*/
      ],
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
              onPaste={handlePaste}
            />
            {/* [ONI]-TODO Add custom placeholder */}
            {/* <input */}
            {/*   ref={attachFileInputRef} */}
            {/*   type="file" */}
            {/*   accept="audio/*, */}
            {/*         video/*, */}
            {/*         image/*, */}
            {/*         .csv,.txt, */}
            {/*         .pdf,application/pdf, */}
            {/*         .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, */}
            {/*         .ppt,.pptx,.potx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation, */}
            {/*         .xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet */}
            {/*         " */}
            {/*   multiple */}
            {/*   style={{ display: 'none' }} */}
            {/*   onClick={(event) => event.stopPropagation()} */}
            {/*   onChange={(e) => { */}
            {/*     const inputElement = e.target; */}
            {/*     if (inputElement.files) { */}
            {/*       void attachFiles(inputElement.files).then( */}
            {/*         () => (inputElement.value = ''), */}
            {/*       ); */}
            {/*     } */}
            {/*   }} */}
            {/* /> */}
          </Slate>
          {/* {attachments.length > 0 && ( */}
          {/*   <ComposerFileAttachments */}
          {/*     attachments={attachments} */}
          {/*     onRemoveAttachment={handleRemoveAttachment} */}
          {/*   /> */}
          {/* )} */}
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
              {/* <Button */}
              {/*   buttonAction="add-attachment" */}
              {/*   icon="Paperclip" */}
              {/*   className={cx(colorsTertiary, medium)} */}
              {/*   onClick={() => { */}
              {/*     handleSelectAttachment(); */}
              {/*     ReactEditor.focus(editor); */}
              {/*   }} */}
              {/* /> */}
            </div>
            <div className="cord-composer-primary-buttons">
              <SendButton
                onClick={() => onSubmit(editor.children)}
                canBeReplaced
                disabled={isEmpty || !isValid}
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

// function updateAttachment(
//   attachments: UploadedFile[],
//   fileName: string,
//   newState: { uploadStatus: UploadedFile['uploadStatus']; url?: string },
// ) {
//   const newAttachments = [...attachments];
//   const uploadedFile = newAttachments.find((a) => a.name === fileName);
//   if (uploadedFile) {
//     uploadedFile.uploadStatus = newState.uploadStatus;

//     if (newState.url) {
//       uploadedFile.url = newState.url;
//     }
//   }
//   return newAttachments;
// }

type ComposerState = { isEmpty: boolean; isValid: boolean };
function useComposerState(
  attachments: UploadedFile[],
): [ComposerState, (newValue: Descendant[]) => void] {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const updateState = useCallback(
    (newValue: Descendant[]) => {
      const composerEmpty = isComposerEmpty(newValue);
      setIsEmpty(composerEmpty);
      const hasFilesAttached = attachments.length > 0;
      const composerHasOnlyWhiteSpaces = hasComposerOnlyWhiteSpaces(newValue);
      setIsValid(
        (!composerEmpty && !composerHasOnlyWhiteSpaces) || hasFilesAttached,
      );
    },
    [attachments.length],
  );

  return [{ isEmpty, isValid }, updateState];
}
