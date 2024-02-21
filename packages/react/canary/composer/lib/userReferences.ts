import type { Element, Editor } from 'slate';
import { Range, Node, Text } from 'slate';
import { isUserReferenceNode } from './util.js';

export const withUserReferences = <T extends Editor>(editor: T): T => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: Element) =>
    isUserReferenceNode(element) ? true : isInline(element);

  editor.isVoid = (element: Element) =>
    isUserReferenceNode(element) ? true : isVoid(element);

  return editor;
};

// TODO: allow any non-\w character?
const ALLOWED_CHARACTERS_BEFORE_REFERENCE = [' ', '\n', '('];

export const getUserReferenceSearchParameters = (
  editor: Editor,
):
  | {
      search: string | undefined;
      range: Range | undefined;
    }
  | undefined => {
  // 1. I should be able to type @ and see a list of all* suggestions
  // 2. I should be able to start a message with a reference
  // 3. I should be able to type an email address without being prompted for the references
  // 4. I should be able to type a person's full name including spaces in the reference autocomplete
  // 5. I should be able to send a message with a reference that didn't match anyone
  // 6. I should be able to escape reference mode even though what I'm typing looks like a reference

  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) {
    // we're either not focused or in text selection mode
    return undefined;
  }
  // Don't show menu if already a user reference node
  if (isUserReferenceNode(Node.parent(editor, selection.anchor.path))) {
    return undefined;
  }

  const [currentPosition] = Range.edges(selection);
  const selectedOffset = currentPosition.offset;
  const currentNode = Node.get(editor, currentPosition.path);
  const currentText = Text.isText(currentNode) && currentNode.text;
  if (!currentText) {
    return undefined;
  }

  let startOffset = -1;
  const selectedCharIndex = selectedOffset - 1;

  let wordCount = 0;

  // This code is looping back from the current/cursor position in the composer, until
  // it finds the beginning of a mention (@ or +), which it marks as the start of a
  // potential search.  The search itself is the text between that position in the
  // composer and the current/cursor position
  for (let i = selectedCharIndex; i >= 0; i--) {
    const char = currentText[i];
    const prevChar: string | undefined = currentText[i - 1];

    if (char === ' ') {
      wordCount++;
    }
    // We do allow one space, to enable searching for e.g. "James Bond", but not two.
    // Other tools allow 4-5 spaces (e.g. Slack). We could tweak this behavior.
    const twoConsecutiveSpaces = char === ' ' && prevChar === ' ';
    if (
      twoConsecutiveSpaces ||
      ((prevChar === '@' || prevChar === '+') && char === ' ')
    ) {
      break;
    }
    if (!prevChar || ALLOWED_CHARACTERS_BEFORE_REFERENCE.includes(prevChar)) {
      if (char === '@') {
        startOffset = i;
        break;
      }
    }
    // Don't keep querying on an ever-growing sentence
    if (wordCount >= 4) {
      break;
    }
  }

  if (startOffset < 0) {
    return undefined;
  }

  return {
    search: currentText.slice(startOffset + 1, selectedOffset),
    range: {
      anchor: { ...currentPosition, offset: startOffset },
      focus: { ...currentPosition, offset: selectedOffset },
    },
  };
};
