import React, { forwardRef, useCallback } from 'react';
import cx from 'classnames';
import type { ClientMessageData } from '@cord-sdk/types';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { MODIFIERS } from '../../common/ui/modifiers.js';
import { useUserData, useViewerData } from '../../hooks/user.js';
import { fontSmall } from '../../common/ui/atomicClasses/fonts.css.js';
import { useTime } from '../../common/effects/useTime.js';
import { iconLarge } from '../../common/ui/atomicClasses/icons.css.js';
import {
  canUndoMessageDelete,
  isUserAuthorOfMessage,
} from '../../common/util.js';
import type { StyleProps } from '../../experimental.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as classes from './Message.css.js';
import { PHOSPHOR_ICONS } from '@cord-sdk/react/components/helpers/Icon.js';

export type MessageTombstoneProps = {
  message: ClientMessageData;
  canUndoDelete: boolean;
  undoDeleteMessage: () => void;
} & StyleProps;

export const MessageTombstone = withCord<
  React.PropsWithChildren<MessageTombstoneProps>
>(
  forwardRef(function MessageTombstone(
    {
      message,
      canUndoDelete,
      undoDeleteMessage,
      className,
      ...restProps
    }: MessageTombstoneProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('message');
    const author = useUserData(message.authorID);

    return (
      <div
        className={cx(className, classes.message, MODIFIERS.deleted)}
        ref={ref}
        data-cord-message-id={message.id}
        data-cord-thread-id={message.threadID}
        {...restProps}
      >
        <PHOSPHOR_ICONS.Trash className={cx(iconLarge, classes.deletedIcon)} />
        <div className={cx(classes.deletedMessageText, fontSmall)}>
          {t('deleted_message', { user: author })}
          {canUndoDelete && (
            <div
              className={cx(classes.undoDeleteButton)}
              onClick={undoDeleteMessage}
            >
              {t('undo_delete_action')}
            </div>
          )}
        </div>
      </div>
    );
  }),
  'MessageTombstone',
);

export function MessageTombstoneWrapper({
  message,
}: {
  message: ClientMessageData;
}) {
  const viewer = useViewerData();
  const time = useTime();
  const userId = viewer?.id;

  const undoDeleteMessage = useCallback(() => {
    undeleteMessage(message.threadID, message.id);
  }, [message.id, message.threadID]);

  if (!message.deletedTimestamp) {
    return <></>;
  }

  const canUndoDelete =
    isUserAuthorOfMessage(message, userId) &&
    canUndoMessageDelete(new Date(message.deletedTimestamp), time);

  return (
    <MessageTombstone
      message={message}
      canUndoDelete={canUndoDelete}
      undoDeleteMessage={undoDeleteMessage}
      canBeReplaced
    />
  );
}

function undeleteMessage(threadID: string, messageID: string) {
  void window?.CordSDK?.thread.updateMessage(threadID, messageID, {
    deleted: false,
  });
}
