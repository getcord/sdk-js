import * as React from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { ForwardedRef } from 'react';

import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import type { Descendant } from 'slate';
import { withHistory } from 'slate-history';

import type { MessageContent } from '@cord-sdk/types';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { CustomEditor } from '../../slateCustom.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { withQuotes } from './plugins/quotes.js';
import { withBullets } from './plugins/bullets.js';
import { withHTMLPaste } from './plugins/paste.js';
import { withEmojis } from './plugins/withEmojis.js';
import { renderElement, renderLeaf } from './lib/render.js';
import {
  createComposerEmptyValue,
  editableStyle,
  hasComposerOnlyWhiteSpaces,
  isComposerEmpty,
} from './lib/util.js';
import { EditorCommands } from './lib/commands.js';

export type TextEditorProps = {
  className?: string;
  style?: React.CSSProperties;
  editor: CustomEditor;
  initialValue?: MessageContent;
  onChange: ({ content }: { content: MessageContent }) => void;
  onPaste: ({ event }: { event: React.ClipboardEvent }) => void;
  onKeyDown: (arg: { event: React.KeyboardEvent }) => void;
  onFocus?: (arg: { event: React.FocusEvent }) => void;
  onBlur?: (arg: { event: React.FocusEvent }) => void;
  onClick?: (arg: { event: React.MouseEvent }) => void;
  placeholder?: string;
};
export const TextEditor = withCord<React.PropsWithChildren<TextEditorProps>>(
  forwardRef(function TextEditor(
    {
      className,
      editor,
      initialValue,
      onChange,
      placeholder,
      onKeyDown,
      onPaste,
      style,
      onFocus,
      onBlur,
      onClick,
    }: TextEditorProps,
    // withCord needs a `ref` at the moment, but slate does not accept any
    _ref: ForwardedRef<HTMLElement>,
  ) {
    const { t } = useCordTranslation('composer');
    const onSlateKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        onKeyDown({ event });
      },
      [onKeyDown],
    );
    const onSlateChange = useCallback(
      (content: MessageContent) => onChange({ content }),
      [onChange],
    );
    const onSlatePaste = useCallback(
      (event: React.ClipboardEvent) => onPaste({ event }),
      [onPaste],
    );
    const onSlateFocus = useCallback(
      (event: React.FocusEvent) => onFocus?.({ event }),
      [onFocus],
    );
    const onSlateBlur = useCallback(
      (event: React.FocusEvent) => onBlur?.({ event }),
      [onBlur],
    );
    const onSlateClick = useCallback(
      (event: React.MouseEvent) => onClick?.({ event }),
      [onClick],
    );
    return (
      <Slate
        editor={editor}
        initialValue={initialValue ?? createComposerEmptyValue()}
        onChange={onSlateChange}
      >
        <Editable
          className={className}
          placeholder={placeholder ?? t('send_message_placeholder')}
          style={{
            outline: 'none',
            // [ONI]-TODO Properly style this.
            padding: '0 8px 16px',
            ...editableStyle,
            ...style,
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onSlateKeyDown}
          onPaste={onSlatePaste}
          onFocus={onSlateFocus}
          onBlur={onSlateBlur}
          onClick={onSlateClick}
        />
        {/* [ONI]-TODO Add custom placeholder */}
      </Slate>
    );
  }),
  'TextEditor',
);

export type UseTextEditorProps = {
  onChange?: (arg: { content: MessageContent }) => void;
  initialValue?: MessageContent;
  placeholder?: string;
  isValid?: (isTextValid: boolean) => boolean; // TODO rename
};

/**
 * Hook that creates state and logic for  text editor that only deals with message content.
 */
export function useTextEditor(props: UseTextEditorProps) {
  const {
    initialValue,
    isValid: isAlreadyValid,
    onChange: onChangeProp,
    ...rest
  } = props;
  const [{ isValid, isEmpty }, updateComposerState] = useEditorState(
    isAlreadyValid ?? ((x) => x),
  );

  // TODO maybe should be a prop
  const [editor] = useState(() =>
    withHTMLPaste(
      withBullets(
        withQuotes(withEmojis(withReact(withHistory(createEditor())))),
      ),
    ),
  );

  const resetEditor = useCallback(
    (newValue?: MessageContent) => {
      const point = { path: [0, 0], offset: 0 };
      editor.selection = { anchor: point, focus: point };
      editor.history = { redos: [], undos: [] };
      editor.children = newValue?.length
        ? newValue
        : createComposerEmptyValue();
      editor.onChange();
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

  const onChange = useCallback(
    ({ content: newValue }: { content: MessageContent }) => {
      const empty = !newValue.length;
      if (empty) {
        EditorCommands.addParagraph(editor, [0]);
      }
      // [ONI]-TODO
      // updateTyping(Node.string(editor).length > 0);
      updateComposerState(newValue);
      onChangeProp?.({ content: newValue });
    },
    [editor, onChangeProp, updateComposerState],
  );

  return {
    onChange,
    editor,
    isEmpty,
    initialValue,
    isValid,
    onResetState: resetEditor,
    ...rest,
  }; //satisfies ComposerProps; TODO FIX
}

type EditorState = { isEmpty: boolean; isValid: boolean };
function useEditorState(
  isAlreadyValid: (isTextValid: boolean) => boolean,
): [EditorState, (newValue: Descendant[]) => void] {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isTextValid, setIsTextValid] = useState(false);

  const updateState = useCallback((newValue: Descendant[]) => {
    const composerEmpty = isComposerEmpty(newValue);
    setIsEmpty(composerEmpty);
    const composerHasOnlyWhiteSpaces = hasComposerOnlyWhiteSpaces(newValue);
    setIsTextValid(!composerEmpty && !composerHasOnlyWhiteSpaces);
  }, []);

  return [{ isEmpty, isValid: isAlreadyValid(isTextValid) }, updateState];
}
