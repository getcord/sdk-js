import * as React from 'react';
import isHotkey from 'is-hotkey';
import { forwardRef, useCallback, useMemo } from 'react';
import { ReactEditor } from 'slate-react';
import type {
  ClientMessageData,
  MessageAttachment,
  MessageContent,
  MessageFileAttachment,
} from '@cord-sdk/types';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import { Keys } from '../../common/const/Keys.js';

import type {
  ComposerProps,
  CordComposerProps,
  EditComposerProps,
  SendComposerProps,
} from '../../experimental/types.js';
import { ReactionPickButton } from '../../experimental.js';
import { WithPopper } from '../../experimental/components/helpers/WithPopper.js';
import { onSpace } from './event-handlers/onSpace.js';
import { onInlineModifier } from './event-handlers/onInlineModifier.js';
import { onDeleteOrBackspace } from './event-handlers/onDeleteOrBackspace.js';
import { onArrow } from './event-handlers/onArrowPress.js';
import { onTab } from './event-handlers/onTab.js';
import { onShiftEnter } from './event-handlers/onShiftEnter.js';
import { EditorCommands, HOTKEYS } from './lib/commands.js';
import { useAddAttachmentToComposer } from './hooks/useAttachments.js';
import { TextEditor, useTextEditor } from './TextEditor.js';
import type { UseTextEditorProps } from './TextEditor.js';
import { ComposerLayout } from './ComposerLayout.js';
import { useCreateSubmit, useEditSubmit } from './hooks/useSubmit.js';
import { useAddMentionToComposer } from './hooks/useMentionList.js';
import { SendButton } from './SendButton.js';
import { thread } from '@cord-sdk/react';

const EMPTY_ATTACHMENTS: MessageAttachment[] = [];

export function useEditComposer(props: EditComposerProps): ComposerProps {
  const onSubmit = useEditSubmit(props);
  const { thread: threadData } = thread.useThread(props.threadId);

  return useCordComposer({
    ...props,
    onSubmit,
    groupID: threadData?.groupID,
  });
}

export function useSendComposer(props: SendComposerProps): ComposerProps {
  const onSubmit = useCreateSubmit(props);
  const { thread: threadData } = thread.useThread(props.threadId!);

  return useCordComposer({
    ...props,
    onSubmit,
    groupID: threadData?.groupID ?? props.createThread?.groupID,
  });
}

export const SendComposer = (props: SendComposerProps) => {
  return <CordComposer canBeReplaced {...useSendComposer(props)} />;
};
export const EditComposer = (props: EditComposerProps) => {
  return <CordComposer canBeReplaced {...useEditComposer(props)} />;
};

export function useCordComposer(props: CordComposerProps): ComposerProps {
  const { onSubmit, initialValue, onAfterSubmit, onBeforeSubmit, groupID } =
    props;
  const initialAttachments =
    initialValue?.attachments as MessageFileAttachment[];

  const base = useComposer({
    ...props,
    initialValue: props.initialValue?.content as MessageContent | undefined,
  });
  const { editor, isEmpty } = base;
  const attachmentsProps = useAddAttachmentToComposer({
    initialAttachments: initialAttachments ?? EMPTY_ATTACHMENTS,
    editor,
  });
  const mentionProps = useAddMentionToComposer({
    editor,
    isEmpty,
    groupID,
  });

  const onChange = useCallback(
    (args: { content: MessageContent }) => {
      base.onChange(args);
      mentionProps.onChange?.(args);
    },
    [base, mentionProps],
  );

  const onKeyDown = useCallback(
    (args: { event: React.KeyboardEvent }) => {
      const prevent = mentionProps.onKeyDown?.(args);
      if (prevent) {
        return prevent;
      }
      return base.onKeyDown(args);
    },
    [base, mentionProps],
  );

  const onPaste = useCallback(
    (args: { event: React.ClipboardEvent }) => {
      attachmentsProps.onPaste?.(args);
      base.onPaste(args);
    },
    [base, attachmentsProps],
  );

  const extraChildren = useMemo(
    () => [
      ...(attachmentsProps.extraChildren ?? []),
      ...(base.extraChildren ?? []),
    ],
    [base.extraChildren, attachmentsProps.extraChildren],
  );

  const toolbarItems = useMemo(
    () => [
      ...(mentionProps.toolbarItems ?? []),
      ...(attachmentsProps.toolbarItems ?? []),
      ...(base.toolbarItems ?? []),
    ],
    [
      base.toolbarItems,
      mentionProps.toolbarItems,
      attachmentsProps.toolbarItems,
    ],
  );

  const value = useMemo(
    () =>
      ({
        attachments: attachmentsProps.attachments as MessageAttachment[],
      }) satisfies Partial<ClientMessageData>,
    [attachmentsProps.attachments],
  );

  const isValid = base.isValid || attachmentsProps.isValid;

  const onSubmitWithBeforeAndAfter = useCallback(
    (args: { message: Partial<ClientMessageData> }) => {
      let message: null | Partial<ClientMessageData> = args.message;
      if (!isValid) {
        return;
      }
      if (onBeforeSubmit) {
        message = onBeforeSubmit({ message })?.message ?? null;
        if (message === null) {
          return;
        }
      }
      onSubmit({ message });
      onAfterSubmit?.(args);
    },
    [onSubmit, onBeforeSubmit, onAfterSubmit, isValid],
  );

  const onResetState = useCallback(() => {
    base.onResetState();
    attachmentsProps.onResetState();
  }, [base, attachmentsProps]);

  return {
    ...base,
    extraChildren,
    isValid,
    toolbarItems,
    onSubmit: onSubmitWithBeforeAndAfter,
    editor: mentionProps.editor,
    onChange,
    onResetState,
    onKeyDown,
    isEmpty,
    onPaste,
    popperElement: mentionProps.popperElement,
    popperElementVisible: mentionProps.popperElementVisible,
    popperOnShouldHide: mentionProps.popperOnShouldHide,
    initialValue,
    value,
    groupID,
  };
}
export function useComposer(
  props: UseTextEditorProps,
): Omit<ComposerProps, 'onSubmit' | 'groupID'> {
  const simpleComposer = useTextEditor(props);
  const { editor } = simpleComposer;
  const onKeyDown = useCallback(
    ({ event }: { event: React.KeyboardEvent }) => {
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
        }
      }

      if (event.key === Keys.TAB) {
        onTab(editor, event);
      }

      if (event.key === Keys.ESCAPE) {
        ReactEditor.blur(editor);
        // [ONI]-TODO handle stop editing
        // likely call onBlur from props
      }
    },
    [editor],
  );

  const value = useMemo(
    () => ({}) satisfies Partial<Omit<ClientMessageData, 'content'>>,
    [],
  );
  const initialValue = useMemo(
    () =>
      ({
        content: simpleComposer.initialValue as MessageContent,
      }) satisfies Partial<ClientMessageData>,
    [simpleComposer.initialValue],
  );
  return {
    ...simpleComposer,
    onKeyDown,
    initialValue,
    value,
    onPaste: () => {},
  };
}

export const CordComposer = withCord<React.PropsWithChildren<ComposerProps>>(
  forwardRef(function CordComposer(
    props: ComposerProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    const {
      editor,
      initialValue,
      value,
      onSubmit,
      onCancel,
      onResetState,
      isValid,
      onKeyDown,
      toolbarItems,
      ...rest
    } = props;

    const insertEmoji = useCallback(
      (emoji: string) => {
        EditorCommands.addEmoji(editor, editor.selection, emoji);
      },
      [editor],
    );
    const toolbarItemsWithDefault = useMemo(() => {
      return [
        ...(toolbarItems ?? []),
        {
          name: 'addEmoji',
          element: (
            <ReactionPickButton
              canBeReplaced
              className={buttonClasses.colorsTertiary}
              onReactionClick={insertEmoji}
            />
          ),
        },
        {
          name: 'sendButton',
          element: (
            <SendButton
              onClick={() => {
                onSubmit({
                  message: {
                    ...initialValue,
                    ...value,
                    content: editor.children,
                  },
                });
                onResetState();
              }}
              canBeReplaced
              disabled={!isValid}
            />
          ),
        },
      ];
    }, [
      editor.children,
      onSubmit,
      onResetState,
      insertEmoji,
      isValid,
      toolbarItems,
      initialValue,
      value,
    ]);

    const onKeyDownWithSubmitAndCancel = useCallback(
      (arg: { event: React.KeyboardEvent }) => {
        const preventDefault = onKeyDown(arg);
        if (preventDefault) {
          return true;
        }
        const { event } = arg;
        if (event.key === Keys.ENTER) {
          if (!event.shiftKey) {
            event.preventDefault();
            if (!isValid) {
              return true;
            }
            onSubmit({
              message: {
                ...initialValue,
                ...value,
                content: editor.children,
              },
            });
            onResetState();
            return true;
          }
        }
        if (event.key === Keys.ESCAPE) {
          return onCancel?.();
        }
        return false;
      },
      [
        isValid,
        onSubmit,
        onCancel,
        onResetState,
        editor.children,
        onKeyDown,
        initialValue,
        value,
      ],
    );

    return (
      <BaseComposer
        ref={ref}
        {...rest}
        isValid={isValid}
        editor={editor}
        onKeyDown={onKeyDownWithSubmitAndCancel}
        toolbarItems={toolbarItemsWithDefault}
        initialValue={initialValue}
      />
    );
  }),
  'Composer',
);

// We remove 'value, because it is in `editor.children`, no need to have more than one source of truth
// There is no send button, and no submit on enter, in the BaseComposer.
type BaseComposerProps = Omit<
  ComposerProps,
  'onSubmit' | 'onResetState' | 'value'
>;

const BaseComposer = forwardRef(function BaseComposer(
  {
    placeholder,
    editor,
    initialValue,
    onPaste,
    onKeyDown,
    onChange,
    toolbarItems,
    extraChildren,
    popperElement,
    popperElementVisible,
    popperOnShouldHide,
    className,
    style,
  }: BaseComposerProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  return (
    <WithPopper
      popperElement={popperElement ?? null}
      popperElementVisible={popperElementVisible ?? false}
      popperPosition="top-start"
      onShouldHide={popperOnShouldHide}
      popperWidth="full"
    >
      <ComposerLayout
        ref={ref}
        canBeReplaced
        textEditor={
          <TextEditor
            canBeReplaced
            className="cord-editor"
            placeholder={placeholder}
            editor={editor}
            initialValue={initialValue?.content as MessageContent | undefined}
            onPaste={onPaste}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        }
        extraChildren={extraChildren}
        toolbarItems={toolbarItems}
        className={className}
        style={style}
      />
    </WithPopper>
  );
});
