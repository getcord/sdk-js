import * as React from 'react';
import { forwardRef, useCallback, useState } from 'react';
import cx from 'classnames';
import type {
  MessageContent as MessageContentType,
  ClientMessageData,
} from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';

import {
  Avatar,
  Button,
  MessageContent,
  OptionsMenu,
  Timestamp,
  Reactions,
  MessageLayout,
} from '../../experimental.js';
import { useEditComposer, CordComposer } from '../composer/Composer.js';
import { EditorCommands } from '../composer/lib/commands.js';
import type { StyleProps } from '../../experimental/types.js';
import { useUserData, useViewerData } from '../../hooks/user.js';
import { AddReactionToMessageButton } from '../../experimental/components/ReactionPickButton.js';
import { useComposedRefs } from '../../common/lib/composeRefs.js';
import { useExtraClassnames } from '../../hooks/useExtraClassnames.js';
import { MODIFIERS } from '../../common/ui/modifiers.js';
import { Username } from './Username.js';
import { MessageTombstoneWrapper } from './MessageTombstone.js';
import { ActionMessage } from './ActionMessage.js';
import { useMessageSeenObserver } from './hooks/useMessageSeenObserver.js';

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

    const messageObserverRef = useMessageSeenObserver(message);
    const composedRef = useComposedRefs<Element | null>(
      ref,
      messageObserverRef,
    );

    const viewerData = useViewerData();

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

    if (message.type === 'action_message') {
      return (
        <ActionMessage
          message={message}
          canBeReplaced
          className={cx(className, metaCordClasses)}
          {...restProps}
        />
      );
    }

    return (
      <MessageLayout
        ref={composedRef}
        canBeReplaced
        className={cx(className, metaCordClasses, {
          [MODIFIERS.noReactions]: message.reactions?.length === 0,
          [MODIFIERS.unseen]: !message.seen,
          [MODIFIERS.fromViewer]: viewerData?.id === message.authorID,
        })}
        message={message}
        avatar={<Avatar canBeReplaced userId={message.authorID} />}
        messageContent={
          <MessageContent
            content={message.content as MessageContentType}
            attachments={message.attachments}
            edited={!!message.updatedTimestamp}
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
