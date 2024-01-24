import * as React from 'react';
import type { ClientMessageData } from '@cord-sdk/types';
import type { RefObject } from 'react';

import { useCallback, useMemo } from 'react';

import { isUserAuthorOfMessage } from '../../../common/util.ts';

import withCord from '../hoc/withCord.tsx';
import { Separator } from '../helpers/Separator.tsx';
import { useViewerData } from '../../../hooks/user.ts';
import { useThread } from '../../../hooks/thread.ts';
import { MenuItem } from './MenuItem.tsx';
import { useCordTranslation } from '@cord-sdk/react';
import { Icon } from '@cord-sdk/react/components/helpers/Icon.tsx';

export type MessageActionsProps = React.PropsWithChildren<{
  closeMenu: () => void;
  threadID: string;
  message: ClientMessageData;
  showSeparator: boolean;
  messageRef?: RefObject<HTMLDivElement>;
}>;

export const MessageActions = withCord<MessageActionsProps>(
  React.forwardRef(function MessageActions(
    {
      closeMenu,
      message,
      threadID,
      showSeparator,
      messageRef,
    }: MessageActionsProps,

    _ref: React.ForwardedRef<HTMLOListElement>,
  ) {
    const { t } = useCordTranslation('message');
    const user = useViewerData();
    const viewerIsAuthorOfMessage = isUserAuthorOfMessage(message, user?.id);

    const { thread } = useThread(threadID);

    // [ONI]-TODO implement, we should get this from prop
    const setMessageToEditMode = useSetComposerToEditMode();
    const onEditButtonClicked = useCallback(() => {
      setMessageToEditMode({
        message,
        thread,
        messageRef,
      });
      closeMenu();
    }, [closeMenu, message, messageRef, setMessageToEditMode, thread]);

    const onDeleteButtonClicked = useCallback(() => {
      deleteMessage(threadID, message.id);
    }, [message.id, threadID]);

    const EditMenuItem = useMemo(
      () =>
        thread?.resolved ? (
          <MenuItem
            menuItemAction={'message-edit-resolved'}
            label={t('edit_resolved_action')}
            leftItem={<Icon name="PencilSimpleLine" size="large" />}
            onClick={(event) => {
              event.stopPropagation();
              void setResolved(threadID, false);
              // [ONI]-TODO if we are in a ThreadList we should call its `onThreadReopen` with fresh thread
              closeMenu();
            }}
          />
        ) : (
          <MenuItem
            menuItemAction={'message-edit'}
            label={t('edit_action')}
            leftItem={<Icon name="PencilSimpleLine" size="large" />}
            onClick={(event) => {
              event.stopPropagation();
              onEditButtonClicked();
            }}
          />
        ),
      [thread, t, threadID, closeMenu, onEditButtonClicked],
    );

    if (!viewerIsAuthorOfMessage) {
      return null;
    }

    const showActionButtons = viewerIsAuthorOfMessage;

    return (
      <>
        {showActionButtons && (
          <>
            {showSeparator && <Separator />}
            {EditMenuItem}
            {!thread?.resolved && (
              <MenuItem
                menuItemAction={'message-delete'}
                label={t('delete_action')}
                leftItem={<Icon name="Trash" size="large" />}
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteButtonClicked();
                }}
              />
            )}
          </>
        )}
      </>
    );
  }),
  'MessageActions',
);

/**
 * @deprecated there likely be no contex,
 * we may get the function from prop.
 */
function useSetComposerToEditMode() {
  return (_args: unknown) => {};
}

async function setResolved(threadID: string, resolved: boolean) {
  return await window?.CordSDK?.thread.updateThread(threadID, {
    resolved,
  });
}

function deleteMessage(threadID: string, messageID: string) {
  void window?.CordSDK?.thread.updateMessage(threadID, messageID, {
    deleted: true,
  });
}
