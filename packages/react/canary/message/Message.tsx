import * as React from 'react';
import { forwardRef, useCallback, useState } from 'react';
import cx from 'classnames';
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
} from '../../betaV2.js';
import { EditComposer } from '../composer/Composer.js';
import { useUserData, useViewerData } from '../../hooks/user.js';
import type {
  ByID,
  CommonMessageProps,
  MessageProps,
  WithByIDComponent,
} from '../../betaV2.js';
import { AddReactionToMessageButton } from '../../experimental/components/ReactionPickButton.js';
import { useComposedRefs } from '../../common/lib/composeRefs.js';
import { useExtraClassnames } from '../../hooks/useExtraClassnames.js';
import { MODIFIERS } from '../../common/ui/modifiers.js';
import { useMessage } from '../../hooks/thread.js';
import { Username } from './Username.js';
import { MessageTombstoneWrapper } from './MessageTombstone.js';
import { ActionMessage } from './ActionMessage.js';
import { useMessageSeenObserver } from './hooks/useMessageSeenObserver.js';

export type MessageByIDProps = {
  messageID: string;
} & CommonMessageProps;

export const Message: WithByIDComponent<MessageProps, MessageByIDProps> =
  Object.assign(
    withCord<React.PropsWithChildren<MessageProps>>(
      forwardRef(function Message(
        {
          message,
          className,
          showThreadOptions = false,
          ...restProps
        }: MessageProps,
        ref: React.ForwardedRef<HTMLElement>,
      ) {
        const [isEditing, setIsEditing] = useState(false);

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
            <EditComposer
              ref={composedRef}
              className={cx(className, metaCordClasses)}
              messageID={message.id}
              initialValue={message}
              onAfterSubmit={() => {
                setIsEditing(false);
              }}
              onCancel={onCancel}
              autofocus
            />
          );
        }
        if (message.deletedTimestamp) {
          return (
            <MessageTombstoneWrapper
              ref={composedRef}
              className={cx(className, metaCordClasses)}
              message={message}
            />
          );
        }

        if (message.type === 'action_message') {
          return (
            <ActionMessage
              ref={composedRef}
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
            avatar={<Avatar.ByID canBeReplaced userID={message.authorID} />}
            messageContent={
              <MessageContent
                content={message.content}
                createdAt={message.createdTimestamp}
                userData={authorData}
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
                threadID={message.threadID}
                button={
                  <Button
                    buttonAction="show-message-options"
                    icon="DotsThree"
                    className={cx(
                      buttonClasses.small,
                      buttonClasses.colorsSecondary,
                    )}
                    canBeReplaced
                  />
                }
                showThreadOptions={showThreadOptions}
                showMessageOptions
                setEditing={setIsEditing}
              />
            }
            emojiPicker={
              <AddReactionToMessageButton
                messageID={message.id}
                threadID={message.threadID}
              />
            }
            reactions={
              <Reactions
                canBeReplaced
                messageID={message.id}
                threadID={message.threadID}
                showReactionList
                showAddReactionButton={message.reactions.length > 0}
              />
            }
            {...restProps}
          />
        );
      }),
      'Message',
    ),
    { ByID: MessageByID },
  );
function MessageByID(props: ByID<MessageByIDProps>) {
  const { messageID, ...restProps } = props;
  const message = useMessage(messageID);

  if (!message) {
    return null;
  }

  return <Message message={message} {...restProps} canBeReplaced />;
}
