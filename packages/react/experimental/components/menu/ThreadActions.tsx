import * as React from 'react';
import { useMemo } from 'react';

import { useThread } from '../../../hooks/thread.js';
import { useCordTranslation } from '../../../hooks/useCordTranslation.js';
import { Icon } from '../../../components/helpers/Icon.js';
import { useToast } from '../../hooks/useToast.js';
import { useViewerData } from '../../../hooks/user.js';
import { setResolved, setSubscribed } from '../../../common/lib/thread.js';
import type { MenuProps } from './Menu.js';
import { MenuItem } from './MenuItem.js';

export type ThreadActionsProps = {
  closeMenu: () => void;
  threadID: string;
  markThreadAsRead?: (threadID: string) => void;
};

export const useThreadActions = ({
  closeMenu,
  threadID,
  markThreadAsRead,
}: ThreadActionsProps) => {
  const { t } = useCordTranslation('thread');

  const { thread } = useThread(threadID);
  const user = useViewerData();

  const { showToastPopup } = useToast();
  return useMemo(() => {
    const items: MenuProps['items'] = [];
    if (!thread || !user) {
      return items;
    }
    const subscribed = thread.subscribers.includes(user.id);
    if (markThreadAsRead) {
      items.push({
        element: (
          <MenuItem
            canBeReplaced
            menuItemAction={'thread-mark-as-read'}
            leftItem={<Icon name="Archive" size="large" />}
            label={t('mark_as_read_action')}
            onClick={(event) => {
              event.stopPropagation();
              markThreadAsRead?.(threadID);
              closeMenu();
            }}
          />
        ),
        name: 'thread-mark-as-read',
      });
    }
    items.push({
      element: (
        <MenuItem
          canBeReplaced
          menuItemAction={
            subscribed ? 'thread-unsubscribe' : 'thread-subscribe'
          }
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
      ),
      name: 'thread-subscribe',
    });

    if (!thread.resolved) {
      items.push({
        element: (
          <MenuItem
            canBeReplaced
            menuItemAction={'thread-resolve'}
            label={t('resolve_action')}
            leftItem={<Icon name="CheckCircle" size="large" />}
            onClick={(event) => {
              event.stopPropagation();
              showToastPopup?.(t('resolve_action_success'));
              void setResolved(threadID, true);
              markThreadAsRead?.(threadID);
              closeMenu();
            }}
          />
        ),
        name: 'thread-resolve',
      });
    }
    return items;
  }, [closeMenu, markThreadAsRead, showToastPopup, t, thread, threadID, user]);
};
