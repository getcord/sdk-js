import * as React from 'react';
import { forwardRef, useCallback, useState } from 'react';
import cx from 'classnames';
import type {
  MessageContent as MessageContentType,
  ClientMessageData,
} from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as classes from '../../components/Message.classnames.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';

import {
  Avatar,
  Button,
  MessageContent,
  OptionsMenu,
  Timestamp,
  Reactions,
} from '../../experimental.js';
import { useEditComposer, CordComposer } from '../composer/Composer.js';
import { EditorCommands } from '../composer/lib/commands.js';
import type { StyleProps } from '../types.js';
import { useUserData } from '../../hooks/user.js';
import { AddReactionToMessageButton } from '../../experimental/components/ReactionPickButton.js';
import { useExtraClassnames } from '../../hooks/useExtraClassnames.js';
import { Username } from './Username.js';
import { MessageTombstoneWrapper } from './MessageTombstone.js';

export type MessageProps = {
  message: ClientMessageData;
  threadID: string;
} & StyleProps;

export const Message = withCord<React.PropsWithChildren<MessageProps>>(
  forwardRef(function Message(
    { message, threadID, className, ...restProps }: MessageProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    const [isEditing, setIsEditing] = useState(false);

    const editorProps = useEditComposer({
      threadId: threadID,
      messageId: message.id,
      initialValue: message,
    });
    const setEditing = useCallback(
      (editing: Parameters<typeof setIsEditing>[0]) => {
        setIsEditing(editing);
        if (editing) {
          setTimeout(() => {
            EditorCommands.focusAndMoveCursorToEndOfText(editorProps.editor);
          }, 0);
        }
      },
      [editorProps.editor],
    );
    const onEditSubmit = useCallback(
      (arg: { message: Partial<ClientMessageData> }) => {
        editorProps.onSubmit(arg);
        setEditing(false);
      },
      [editorProps, setEditing],
    );
    const onCancel = useCallback(() => {
      setIsEditing(false);
    }, []);

    const authorData = useUserData(message.authorID);
    const metaCordClasses = useExtraClassnames(message.extraClassnames);

    if (isEditing) {
      return (
        <CordComposer
          canBeReplaced
          {...editorProps}
          onSubmit={onEditSubmit}
          onResetState={() => setIsEditing(false)}
          onCancel={onCancel}
        />
      );
    }

    if (message.deletedTimestamp) {
      return <MessageTombstoneWrapper message={message} />;
    }

    return (
      <MessageLayout
        ref={ref}
        canBeReplaced
        className={cx(className, metaCordClasses)}
        avatar={<Avatar canBeReplaced userId={message.authorID} />}
        messageContent={
          <MessageContent
            // [ONI]-TODO: fix type in MessageContent and below
            // content is merged with HTMLAttributes<HTMLDivElement>['content']
            content={message.content as MessageContentType & string}
            attachments={message.attachments}
            // [ONI]-TODO: implement
            edited={false}
            canBeReplaced
          />
        }
        authorName={<Username canBeReplaced userData={authorData} />}
        timestamp={
          <Timestamp
            canBeReplaced
            value={message.createdTimestamp}
            type="message"
          />
        }
        optionsMenu={
          <OptionsMenu
            canBeReplaced
            message={message}
            threadID={threadID}
            button={
              <Button
                buttonAction="show-message-options"
                type="button"
                icon="DotsThree"
                className={buttonClasses.small}
                canBeReplaced
              />
            }
            showThreadOptions
            showMessageOptions
            setEditing={setEditing}
          />
        }
        emojiPicker={
          <AddReactionToMessageButton
            messageID={message.id}
            threadID={threadID}
          />
        }
        reactions={
          <Reactions
            canBeReplaced
            messageId={message.id}
            threadId={threadID}
            showReactionList
            showAddReactionButton={message.reactions.length > 0}
          />
        }
        {...restProps}
      />
    );
  }),
  'Message',
);
export type MessageLayoutProps = {
  messageContent: JSX.Element;
  avatar: JSX.Element;
  emojiPicker: JSX.Element;
  timestamp: JSX.Element;
  optionsMenu: JSX.Element;
  reactions: JSX.Element;
  authorName: JSX.Element;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Replacing MessageLayout enables rendering Message components
 * in any layout. This allows you to completely change the DOM structure,
 * and achieve design that would be hard or impossible with CSS alone.
 *
 * Through the props you get all elements of the message, already rendered.
 */
export const MessageLayout = withCord<MessageLayoutProps>(
  forwardRef(function MessageLayout(
    props: MessageLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      avatar,
      timestamp,
      optionsMenu,
      emojiPicker,
      messageContent,
      reactions,
      authorName,
      className,
      ...restProps
    } = props;
    return (
      <div {...restProps} className={cx(className, classes.message)} ref={ref}>
        {avatar}
        {authorName}
        {timestamp}
        <div className={classes.optionsMenuTrigger}>
          <div className="cord-message-options-buttons">
            {optionsMenu}
            {emojiPicker}
          </div>
        </div>
        {messageContent}
        {reactions}
      </div>
    );
  }),
  'MessageLayout',
);
