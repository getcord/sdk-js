import * as React from 'react';
import { MessageNodeType } from '@cord-sdk/types';
import type {
  ClientMessageData,
  FormatStyle,
  MessageContent,
  MessageNode,
} from '@cord-sdk/types';
import { MessageBulletElement } from '../../../components/message/MessageBulletElement';
import { EditedMessage } from '../../../components/message/EditedMessage';
import { getMessageNodeChildren } from '../../../common/lib/messageNode';
import { PARAGRAPH_STYLE } from '../../../common/lib/styles';
import { wrapTextNodeWithStyles } from '../editor/render';
import * as classes from '../../../components/message/MessageText.css';
import withCord from '../hoc/withCord';
import { MessageUserReferenceElement } from './MessageUserReferenceElement';

export type MessageTextProps = {
  message: ClientMessageData | null | undefined;
  content: MessageContent | null | undefined;
  wasEdited: boolean;
  isMessageBeingEdited?: boolean;
  hideAnnotationAttachment: boolean;
  formatStyle?: FormatStyle;
} & React.HTMLAttributes<HTMLDivElement>;

export const MessageText = withCord<React.PropsWithChildren<MessageTextProps>>(
  React.forwardRef(function MessageText(
    {
      message,
      content,
      wasEdited,
      isMessageBeingEdited,
      hideAnnotationAttachment,
      formatStyle,
    }: MessageTextProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const showEditMessage = wasEdited || isMessageBeingEdited;
    return (
      <div dir="auto" className={classes.messageText} ref={ref}>
        {content && (
          <RenderedContent
            nodes={content}
            message={message}
            showEditMessage={showEditMessage}
            isMessageBeingEdited={isMessageBeingEdited}
            hideAnnotationAttachment={hideAnnotationAttachment}
            formatStyle={formatStyle}
          />
        )}
      </div>
    );
  }),
  'MessageText',
);

function RenderedContent(props: {
  nodes: MessageContent;
  message: ClientMessageData | null | undefined;
  parent?: MessageNode;
  showEditMessage?: boolean;
  isMessageBeingEdited?: boolean;
  hideAnnotationAttachment?: boolean;
  formatStyle?: FormatStyle;
}) {
  // [ONI]-TODO useTranslatedMessageContent
  return messageContent({ ...props, nodes: props.nodes });
}

function messageContent({
  nodes,
  message,
  parent,
  showEditMessage,
  isMessageBeingEdited,
  formatStyle,
}: {
  nodes: MessageContent;
  message: ClientMessageData | null | undefined;
  parent?: MessageNode;
  showEditMessage?: boolean;
  isMessageBeingEdited?: boolean;
  hideAnnotationAttachment?: boolean;
  formatStyle?: FormatStyle;
}) {
  // If applicable, (Edited) is tagged on as a new <p> at the end of the message,
  // unless the last node was a <p> in which case it is embedded inside as a <span>
  let editedTagIncludedInline = false;

  const content = nodes.map((node, index) => {
    const includeEditedTag =
      showEditMessage &&
      index === nodes.length - 1 &&
      node.type === MessageNodeType.PARAGRAPH;
    if (includeEditedTag) {
      editedTagIncludedInline = true;
    }
    return (
      <RenderNode
        key={index}
        node={node}
        message={message}
        index={index}
        parent={parent}
        showEditMessage={includeEditedTag}
        isMessageBeingEdited={!!isMessageBeingEdited}
        formatStyle={formatStyle}
      />
    );
  });
  if (showEditMessage && !editedTagIncludedInline) {
    content.push(
      <EditedMessage
        as={'p'}
        key={'edited-message'}
        isMessageBeingEdited={!!isMessageBeingEdited}
      />,
    );
  }
  return content;
}

export function RenderNode({
  node,
  message,
  index,
  parent,
  showEditMessage,
  isMessageBeingEdited,
  formatStyle = 'normal',
}: {
  node: MessageNode;
  message: ClientMessageData | null | undefined;
  index: number;
  parent?: MessageNode;
  showEditMessage?: boolean;
  isMessageBeingEdited?: boolean;
  hideAnnotationAttachment?: boolean;
  formatStyle?: FormatStyle;
}): JSX.Element | null {
  switch (node.type) {
    case MessageNodeType.ANNOTATION: {
      // [ONI]-TODO: Maybe implement?
      return null;
    }
    case MessageNodeType.BULLET:
      return (
        <MessageBulletElement key={index} className={node.class}>
          {messageContent({
            nodes: node.children,
            message,
            formatStyle,
          })}
        </MessageBulletElement>
      );
    case MessageNodeType.CODE:
      return (
        <pre key={index} className={node.class}>
          {messageContent({
            nodes: node.children,
            message,
            formatStyle,
          })}
        </pre>
      );
    case MessageNodeType.LINK_DEPRECATED:
      return (
        <a key={index} href={node.url} target="_blank" rel="noreferrer">
          {node.text}
        </a>
      );
    case MessageNodeType.LINK:
      return (
        <a
          key={index}
          className={node.class}
          href={node.url}
          target="_blank"
          rel="noreferrer"
        >
          {/* Pass parent node so we know not to nest another <a> tag */}
          {messageContent({
            nodes: node.children,
            message,
            parent: node,
            formatStyle,
          })}
        </a>
      );
    case MessageNodeType.MENTION:
    case MessageNodeType.ASSIGNEE:
      return (
        <MessageUserReferenceElement
          key={index}
          className={node.class}
          userID={node.user.id}
          referencedUserData={[]} //{message?.referencedUserData ?? []}
          nodeType={node.type}
          formatStyle={formatStyle}
        />
      );
    case MessageNodeType.NUMBER_BULLET:
      return (
        <MessageBulletElement
          key={index}
          className={node.class}
          bulletNumber={node.bulletNumber}
        >
          {messageContent({
            nodes: node.children,
            message,
            formatStyle,
          })}
        </MessageBulletElement>
      );
    case MessageNodeType.PARAGRAPH:
      return (
        <p key={index} className={node.class} style={PARAGRAPH_STYLE}>
          {messageContent({
            nodes: node.children,
            message,
            formatStyle,
          })}
          {/* If applicable, (Edited) is tagged on as a new <p> at the end of the message, 
            unless the last node was a <p> in which case it is embedded inside as a <span> */}
          {showEditMessage && (
            <EditedMessage
              as={'span'}
              isMessageBeingEdited={!!isMessageBeingEdited}
              key={'edited-message'}
            />
          )}
        </p>
      );
    case MessageNodeType.QUOTE:
      return (
        <blockquote key={index} className={node.class} style={PARAGRAPH_STYLE}>
          {messageContent({
            nodes: node.children,
            message,
            formatStyle,
          })}
        </blockquote>
      );
    case MessageNodeType.TODO:
      // [ONI]-TODO maybe implement?
      return null;
    case MessageNodeType.SLACK_MENTION:
      // this should never really be a case because this kind of node doesn't get written to db
      // but just in case.
      return <span>@{node.slackUserID}</span>;
    default: {
      // it's probably text
      if (node.text !== undefined) {
        if (parent?.type === MessageNodeType.LINK) {
          return (
            <React.Fragment key={index}>
              {wrapTextNodeWithStyles(<>{node.text}</>, node)}
            </React.Fragment>
          );
        }
        // [ONI]-TODO Use Linkify when available, instead of this span.
        return (
          <span key={index}>
            {wrapTextNodeWithStyles(<>{node.text}</>, node)}
          </span>
        );
        // );
      } else {
        // but just in case it's not
        return (
          <React.Fragment key={index}>
            {messageContent({
              nodes: getMessageNodeChildren(node),
              message,
              formatStyle,
            })}
          </React.Fragment>
        );
      }
    }
  }
}
