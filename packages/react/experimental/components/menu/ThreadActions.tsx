import * as React from 'react';
import { useThread } from '../../../hooks/thread.ts';
import { useCordTranslation } from '../../../hooks/useCordTranslation.tsx';
import { Icon } from '../../../components/helpers/Icon.tsx';
import { useToast } from '../../hooks/useToast.tsx';
import { useViewerData } from '../../../hooks/user.ts';
import { setResolved, setSubscribed } from '../../../common/lib/thread.ts';
import { MenuItem } from './MenuItem.tsx';

export type ThreadActionsProps = {
  closeMenu: () => void;
  threadID: string;
  markThreadAsRead?: (threadID: string) => void;
};

export function ThreadActions({
  closeMenu,
  threadID,
  markThreadAsRead,
}: ThreadActionsProps) {
  const { t } = useCordTranslation('thread');

  const { thread } = useThread(threadID);
  const user = useViewerData();

  const { showToastPopup } = useToast();
  if (!thread || !user) {
    return null;
  }
  const subscribed = thread.subscribers.includes(user.id);

  return (
    <>
      {!!markThreadAsRead && (
        <MenuItem
          menuItemAction={'thread-mark-as-read'}
          leftItem={<Icon name="Archive" size="large" />}
          label={t('mark_as_read_action')}
          onClick={(event) => {
            event.stopPropagation();
            markThreadAsRead?.(threadID);
            closeMenu();
          }}
        />
      )}
      <MenuItem
        menuItemAction={'thread-subscribe'}
        label={t(subscribed ? 'unsubscribe_action' : 'subscribe_action')}
        leftItem={
          <Icon name={subscribed ? 'BellSlash' : 'Bell'} size="large" />
        }
        onClick={(event) => {
          event.stopPropagation();
          showToastPopup?.(
            t(
              subscribed
                ? 'unsubscribe_action_success'
                : 'subscribe_action_success',
            ),
          );
          void setSubscribed(threadID, !subscribed);
          closeMenu();
        }}
      />
      {!thread.resolved && (
        <MenuItem
          menuItemAction={'thread-resolve'}
          label={t('resolve_action')}
          leftItem={<Icon name="CheckCircle" size="large" />}
          onClick={(event) => {
            event.stopPropagation();
            showToastPopup?.(t('resolve_action_success'));
            setResolved(threadID, true);
            markThreadAsRead?.(threadID);
            closeMenu();
          }}
        />
      )}
    </>
  );
}
