import type { UUID } from './core';

export enum MessageNodeType {
  ANNOTATION = 'annotation',
  ASSIGNEE = 'assignee',
  BULLET = 'bullet',
  CODE = 'code',
  LINK_DEPRECATED = 'a',
  LINK = 'link',
  MENTION = 'mention',
  SLACK_MENTION = 'slack_mention',
  NUMBER_BULLET = 'number_bullet',
  PARAGRAPH = 'p',
  QUOTE = 'quote',
  TODO = 'todo',
}

export type MessageContent = MessageNode[];

type MessageAnyNode =
  | MessageAnnotationNode
  | MessageAssigneeNode
  | MessageBulletNode
  | MessageCodeNode
  | MessageLinkDeprecatedNode
  | MessageLinkNode
  | MessageMentionNode
  | MessageSlackMentionNode
  | MessageNumberBulletNode
  | MessageParagraphNode
  | MessageQuoteNode
  | MessageTextNode
  | MessageTodoNode;

export type MessageNode<N extends MessageNodeType | undefined | null = null> =
  N extends null
    ? MessageAnyNode
    : N extends undefined
    ? MessageTextNode
    : N extends MessageNodeType.ANNOTATION
    ? MessageAnnotationNode
    : N extends MessageNodeType.ASSIGNEE
    ? MessageAssigneeNode
    : N extends MessageNodeType.BULLET
    ? MessageBulletNode
    : N extends MessageNodeType.CODE
    ? MessageCodeNode
    : N extends MessageNodeType.SLACK_MENTION
    ? MessageSlackMentionNode
    : N extends MessageNodeType.LINK_DEPRECATED
    ? MessageLinkDeprecatedNode
    : N extends MessageNodeType.LINK
    ? MessageLinkNode
    : N extends MessageNodeType.MENTION
    ? MessageMentionNode
    : N extends MessageNodeType.NUMBER_BULLET
    ? MessageNumberBulletNode
    : N extends MessageNodeType.PARAGRAPH
    ? MessageParagraphNode
    : N extends MessageNodeType.QUOTE
    ? MessageQuoteNode
    : N extends MessageNodeType.TODO
    ? MessageTodoNode
    : MessageAnyNode;

export type MessageNodeBase = {
  type?: MessageNodeType;
  class?: string;
};
export type MessageNodeWithChildren = MessageNodeBase & {
  children: MessageContent;
};
export type MessageAnnotationNode = MessageNodeWithChildren & {
  type: MessageNodeType.ANNOTATION;
  annotation: {
    id: UUID;
  };
};

export type MessageBulletNode = MessageNodeWithChildren & {
  type: MessageNodeType.BULLET;
};

export type MessageCodeNode = MessageNodeWithChildren & {
  type: MessageNodeType.CODE;
};

export type MessageLinkDeprecatedNode = MessageNodeBase & {
  type: MessageNodeType.LINK_DEPRECATED;
  text: string;
  url: string;
};

export type MessageLinkNode = MessageNodeWithChildren & {
  type: MessageNodeType.LINK;
  url: string;
};

export type MessageMentionNode = MessageNodeWithChildren & {
  type: MessageNodeType.MENTION;
  // defining it this way instead of userID directly to maintain compatibility with
  // previous messages where we would store the entire User object
  user: { id: UUID };
};

export type MessageAssigneeNode = MessageNodeWithChildren & {
  type: MessageNodeType.ASSIGNEE;
  // defined this way to match MessageMentionNode
  user: { id: UUID };
};

export type MessageSlackMentionNode = MessageNodeWithChildren & {
  type: MessageNodeType.SLACK_MENTION;
  slackUserID: string;
};

export type MessageNumberBulletNode = MessageNodeWithChildren & {
  type: MessageNodeType.NUMBER_BULLET;
  bulletNumber: number;
};

export type MessageParagraphNode = MessageNodeWithChildren & {
  type: MessageNodeType.PARAGRAPH;
};

export type MessageQuoteNode = MessageNodeWithChildren & {
  type: MessageNodeType.QUOTE;
};

export const MARKS = ['bold', 'italic', 'underline', 'code'] as const;
export type Mark = (typeof MARKS)[number];

export type MessageTextNode = MessageNodeBase & {
  type?: undefined;
  text: string;
} & {
  [mark in Mark]?: boolean;
};

export type MessageTodoNode = MessageNodeWithChildren & {
  type: MessageNodeType.TODO;
  todoID: UUID;
  done: boolean;
};

export type MessageNodeProps<M extends MessageNodeType> = Omit<
  MessageNode<M>,
  'type' | 'children'
>;
