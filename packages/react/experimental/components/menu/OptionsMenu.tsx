import * as React from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import type { ClientMessageData } from '@cord-sdk/types';
import { DefaultTooltip } from '../WithTooltip.js';
import withCord from '../hoc/withCord.js';
import type { StyleProps } from '../../../experimental/types.js';
import * as classes from '../../../components/OptionsMenu.css.js';
import { useCordTranslation } from '../../../index.js';
import { MenuButton } from './Menu.js';
import type { MenuProps } from './Menu.js';
import { useMessageActions } from './MessageActions.js';
import { ShareToEmailMenu } from './ShareToEmailMenu.js';
import { SlackChannelsMenu } from './SlackChannelsMenu.js';
import { useThreadActions } from './ThreadActions.js';

type MenuTypes =
  | 'actionsMenu'
  | 'slackChannelSelectMenu'
  | 'shareToEmailMenu'
  | null;

export type OptionsMenuProps = {
  threadID: string;
  button: JSX.Element;
  disableTooltip?: boolean;
  markThreadAsRead?: (threadID: string) => void;
  showThreadOptions: boolean;
  showMessageOptions: boolean;
  message?: ClientMessageData;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
} & StyleProps;

export const OptionsMenu = withCord<React.PropsWithChildren<OptionsMenuProps>>(
  forwardRef(function OptionsMenu(
    props: OptionsMenuProps,
    _ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      threadID,
      button,
      showThreadOptions,
      showMessageOptions,
      message,
      setEditing,
    } = props;
    const [menuToShow, setMenuToShow] = useState<MenuTypes>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const { t } = useCordTranslation('message');

    const handleOnClose = useCallback(() => {
      setMenuVisible(false);
      setMenuToShow(null);
    }, [setMenuVisible, setMenuToShow]);

    const handleOnShow = useCallback(() => {
      setMenuToShow((prev) => (prev ? null : 'actionsMenu'));
      setMenuVisible(true);
    }, [setMenuVisible, setMenuToShow]);

    const handleSetMenuVisible = useCallback(
      (visible: boolean) => {
        setMenuVisible(() => {
          if (visible) {
            handleOnShow();
          } else {
            handleOnClose();
          }
          return visible;
        });
      },
      [handleOnClose, handleOnShow, setMenuVisible],
    );

    const actionsMenuItems = useOptionsMenuActionsItems({
      threadID,
      showThreadOptions,
      showMessageOptions,
      handleOnClose,
      message,
      setEditing,
    });

    const menuItems = useMemo(() => {
      switch (menuToShow) {
        case 'slackChannelSelectMenu':
          return [
            {
              name: 'slack-channel-menu',
              element: (
                <div
                  key="slack-channel-menu"
                  className={classes.slackChannelSelectMenuContainer}
                >
                  <SlackChannelsMenu
                    onBackButtonClick={() => setMenuToShow('actionsMenu')}
                    onClose={handleOnClose}
                    threadID={threadID}
                  />
                </div>
              ),
            },
          ];
        case 'shareToEmailMenu':
          return [
            {
              name: 'share-to-email-menu',
              element: (
                <div
                  key="share-to-email-menu"
                  className={classes.shareToEmailMenuContainer}
                >
                  <ShareToEmailMenu
                    threadID={threadID}
                    onBackButtonClick={() => setMenuToShow('actionsMenu')}
                    onClose={handleOnClose}
                  />
                </div>
              ),
            },
          ];
        default:
          return actionsMenuItems;
      }
    }, [menuToShow, threadID, handleOnClose, actionsMenuItems]);

    const buttonLabel = t('message_options_tooltip');
    return (
      <MenuButton
        menuVisible={menuVisible}
        menuItems={menuItems}
        buttonTooltipLabel={buttonLabel}
        button={button}
        setMenuVisible={handleSetMenuVisible}
      />
    );
  }),
  'OptionsMenu',
);

type UseOptionsMenuItems = {
  threadID: string;
  markThreadAsRead?: (threadID: string) => void;
  showMessageOptions: boolean;
  showThreadOptions: boolean;
  message?: ClientMessageData;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnClose: () => void;
};
export function useOptionsMenuActionsItems({
  threadID,
  setEditing,
  markThreadAsRead,
  message,
  showMessageOptions,
  showThreadOptions,
  handleOnClose,
}: UseOptionsMenuItems) {
  const threadActions = useThreadActions({
    closeMenu: handleOnClose,
    threadID,
    markThreadAsRead,
  });

  const messageActions = useMessageActions({
    showSeparator: showThreadOptions,
    closeMenu: handleOnClose,
    threadID: threadID,
    message: message,
    setEditing: setEditing,
  });
  return useMemo(() => {
    const items: MenuProps['items'] = [];
    if (showThreadOptions) {
      items.push(...threadActions);
    }

    if (!!message && !!showMessageOptions) {
      items.push(...messageActions);
    }
    return items;
  }, [
    message,
    showThreadOptions,
    showMessageOptions,
    threadActions,
    messageActions,
  ]);
}

export type OptionsMenuTooltipProps = object;
export const OptionsMenuTooltip = withCord<OptionsMenuTooltipProps>(
  forwardRef(function OptionsMenuTooltip(
    _: OptionsMenuTooltipProps,
    _ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('message');
    return <DefaultTooltip label={t('message_options_tooltip')} />;
  }),
  'OptionsMenuTooltip',
);
