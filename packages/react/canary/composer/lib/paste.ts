import { Text } from 'slate';
import { jsx } from 'slate-hyperscript';

import type {
  MessageNode,
  MessageContent,
  MessageParagraphNode,
} from '@cord-sdk/types';
import { MessageNodeType } from '@cord-sdk/types';
import { trimStart } from '../../../common/lib/trim.js';
import {
  isMessageNodeType,
  createLinkNode,
} from '../../../common/lib/messageNode.js';

const RICH_CONTENT_TAGS = ['BLOCKQUOTE', 'PRE', 'LI'];

export type MessageSlackMentionNode = {
  type: 'slack_mention';
  slackUserID: string;
};

function createSlackMentionNode(slackUserID: string) {
  return {
    type: 'slack_mention',
    slackUserID,
    children: [{ text: slackUserID }],
  };
}

function createElement<
  NodeType extends MessageNodeType,
  NodeAttributes extends MessageNode<NodeType> = MessageNode<NodeType>,
>(
  type: NodeType,
  children: any[],
  nodeAttributes?: Omit<NodeAttributes, 'type' | 'children'>,
) {
  return jsx('element', { type, ...nodeAttributes }, children);
}

function isPLike(elementType: string) {
  return elementType === 'P';
}

function isSlackMention(element: HTMLElement) {
  return (
    element.nodeName === 'SPAN' &&
    element.classList.contains('s-mention') &&
    element.classList.contains('s-user')
  );
}

// Recursively deserialize HTML
export function deserializeElementToMessageContent(
  element: HTMLElement,
  excludeRichContent: boolean,
): any {
  return deserializeElement(element, excludeRichContent, [], null);
}

// We can't use Node constants here because this is shared with server-side
// handling of Slack messages, so create our own constants for them.
const ELEMENT_NODE = 1; // From Node.ELEMENT_NODE
const TEXT_NODE = 3; // From Node.TEXT_NODE

function deserializeElement(
  element: HTMLElement,
  excludeRichContent: boolean,
  parentTypes: string[],
  listType: 'UL' | 'OL' | null,
) {
  const { nodeType, nodeName } = element;

  if (nodeType !== ELEMENT_NODE) {
    return nodeType === TEXT_NODE ? element.textContent : null;
  }
  parentTypes.push(nodeName);

  if (nodeName === 'OL' || nodeName === 'UL') {
    listType = nodeName;
  }

  // Deserialize children recursively first
  const childNodes = Array.from(element.childNodes);

  const children: any[] = childNodes
    .map((childNode) =>
      deserializeElement(
        childNode as HTMLElement,
        excludeRichContent,
        parentTypes,
        listType,
      ),
    )
    .flat();

  parentTypes.pop();

  if (isSlackMention(element)) {
    return createSlackMentionNode(
      trimStart((element.textContent ?? '').trim(), '@'),
    );
  }

  const isParagraphElement =
    isPLike(nodeName) ||
    (excludeRichContent && RICH_CONTENT_TAGS.includes(nodeName));
  const inParagraphAlready = parentTypes.some(
    (x) =>
      isPLike(x) ||
      parentTypes.includes('LI') ||
      (excludeRichContent && RICH_CONTENT_TAGS.includes(x)),
  );

  if (isParagraphElement) {
    if (!inParagraphAlready) {
      return createElement(MessageNodeType.PARAGRAPH, children);
    } else {
      return children;
    }
  }

  // Return child
  switch (nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children);
    case 'BLOCKQUOTE':
      return createElement(MessageNodeType.QUOTE, children);
    case 'PRE':
      return createElement(MessageNodeType.CODE, children);
    case 'LI':
      if (listType === 'OL') {
        return createElement(
          MessageNodeType.NUMBER_BULLET,
          [createElement(MessageNodeType.PARAGRAPH, children)],
          {
            bulletNumber: 0, // This will get fixed up by withBullets
            indent:
              parentTypes.filter((p) => p === 'OL' || p === 'UL').length - 1,
          },
        );
      } else {
        return createElement(
          MessageNodeType.BULLET,
          [createElement(MessageNodeType.PARAGRAPH, children)],
          {
            indent:
              parentTypes.filter((p) => p === 'OL' || p === 'UL').length - 1,
          },
        );
      }
    case 'A':
      return !element.getAttribute('href')?.startsWith('http')
        ? children
        : createLinkNode(
            element.getAttribute('href') ?? '',
            element.textContent!,
          );
    case 'BR':
      return { text: '\n' };
    case 'UL':
    case 'OL':
      return children;
    // We ignore B as google docs treat B as non-bold
    case 'STRONG':
      return { text: element.textContent, bold: true };
    case 'EM':
    case 'I':
      return { text: element.textContent, italic: true };
    case 'U':
      return { text: element.textContent, underline: true };
    default:
      return children;
  }
}

export function cleanPastedNodes(nodes: MessageContent, reduceNewlines = true) {
  const mergedNodes = mergeInlineNodesIntoParagraphs(nodes);
  const cleanNodes = [];
  for (const node of mergedNodes) {
    cleanNodes.push(...cleanTopLevelNode(node, reduceNewlines));
  }
  return cleanNodes;
}

function mergeInlineNodesIntoParagraphs(nodes: MessageContent) {
  const mergedNodes = [];
  let nodesToMerge = [];
  for (const node of nodes) {
    const inlineNode =
      !node.type ||
      node.type === MessageNodeType.LINK ||
      node.type === MessageNodeType.MENTION;
    if (inlineNode) {
      nodesToMerge.push(node);
    } else {
      if (nodesToMerge.length) {
        mergedNodes.push({
          type: MessageNodeType.PARAGRAPH,
          children: nodesToMerge,
        });
        nodesToMerge = [];
      }
      mergedNodes.push(node);
    }
  }
  if (nodesToMerge.length) {
    mergedNodes.push({
      type: MessageNodeType.PARAGRAPH,
      children: nodesToMerge,
    });
  }
  return mergedNodes;
}

function cleanTopLevelNode(node: any, reduceNewlines: boolean) {
  // Split paragraphs by newline character, stripping out empty newlines
  if (isMessageNodeType(node, MessageNodeType.PARAGRAPH)) {
    const { children } = node;
    const paragraphNode: MessageParagraphNode = {
      type: MessageNodeType.PARAGRAPH,
      children: [],
    };
    const nodes = [paragraphNode];
    const addToParagraph = (n: any) => {
      nodes[nodes.length - 1].children.push(n);
    };

    for (const child of children) {
      if (!Text.isText(child)) {
        addToParagraph(child);
        continue;
      }
      const { text, ...otherProps } = child;
      if (text.includes('\n')) {
        let startChar = 0;
        for (let i = 0; i < text.length; i++) {
          const nextChar = text[i + 1];
          if (nextChar === '\n' || !nextChar) {
            const slice = text.slice(startChar, i + 1);
            if (slice) {
              if (!reduceNewlines || !isEmptyOrNewline(slice)) {
                paragraphNode.children.push({
                  text: slice,
                  ...otherProps,
                });
              }
              startChar = i + 1;
              nodes.push({
                type: MessageNodeType.PARAGRAPH,
                children: [],
              });
            }
          }
        }
      } else if (!isNewlines(child.text)) {
        addToParagraph({ text: child.text, ...otherProps });
      }
    }

    const nodesToAdd = nodes.filter((n) => n.children.length);
    return nodesToAdd.length ? nodesToAdd : [];
  } else {
    const isBullet =
      isMessageNodeType(node, MessageNodeType.BULLET) ||
      isMessageNodeType(node, MessageNodeType.NUMBER_BULLET);
    if (isBullet) {
      // Disallow newlines in bullets
      // Note that bullet children are converted into paragraphs in withBullets function
      for (const child of node.children) {
        if ('text' in child) {
          child.text = child.text.replaceAll('\n', '');
        }
      }
    }
  }

  return [node];
}

function isEmptyOrNewline(text: string) {
  return text.split('').every((char) => char === ' ' || char === '\n');
}

function isNewlines(text: string) {
  return text.split('').every((char) => char === '\n');
}
