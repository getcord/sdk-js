import * as React from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';

import type { ClientMessageData } from '@cord-sdk/types';
import { WithPopper } from '../helpers/WithPopper.js';
import { DefaultTooltip, WithTooltip } from '../WithTooltip.js';
import withCord from '../hoc/withCord.js';
import * as classes from '../../../components/OptionsMenu.css.js';
import { useCordTranslation } from '../../../index.js';
import { Menu } from './Menu.js';
import { MessageActions } from './MessageActions.js';
import { ShareToEmailMenu } from './ShareToEmailMenu.js';
import { SlackChannelsMenu } from './SlackChannelsMenu.js';
import { ThreadActions } from './ThreadActions.js';

type MenuTypes =
  | 'actionsMenu'
  | 'slackChannelSelectMenu'
  | 'shareToEmailMenu'
  | null;

export type OptionsMenuProps = {
  threadID: string;
  button: JSX.Element;
  disableTooltip?: boolean;
  getClassName?: (menuVisible: boolean) => string;
  markThreadAsRead?: (threadID: string) => void;
  setMenuShowing?: (state: boolean) => void;
  showThreadOptions: boolean;
  showMessageOptions: boolean;
  message?: ClientMessageData;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLDivElement>;

export const OptionsMenu = withCord<React.PropsWithChildren<OptionsMenuProps>>(
  forwardRef(function OptionsMenu(
    {
      threadID,
      button,
      disableTooltip = false,
      getClassName,
      markThreadAsRead,
      setMenuShowing,
      showThreadOptions,
      showMessageOptions,
      message,
      onClick,
      setEditing,
      ...restProps
    }: OptionsMenuProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const [menuToShow, setMenuToShow] = useState<MenuTypes>(null);

    const handleOnClose = useCallback(() => {
      setMenuShowing?.(false);
      setMenuToShow(null);
    }, [setMenuShowing]);

    const menuItems = useMemo(() => {
      const items = [];
      if (showThreadOptions) {
        items.push({
          element: (
            <ThreadActions
              key="thread-actions-menu"
              threadID={threadID}
              closeMenu={handleOnClose}
              markThreadAsRead={markThreadAsRead}
            />
          ),
          name: 'thread-actions-menu',
        });
      }

      if (!!message && !!showMessageOptions) {
        items.push({
          element: (
            <MessageActions
              canBeReplaced
              showSeparator={showThreadOptions}
              closeMenu={handleOnClose}
              threadID={threadID}
              message={message}
              setEditing={setEditing}
            />
          ),
          name: 'message-actions-menu',
        });
      }
      return items;
    }, [
      handleOnClose,
      markThreadAsRead,
      message,
      showThreadOptions,
      threadID,
      showMessageOptions,
      setEditing,
    ]);
    const popperElement = useMemo(() => {
      switch (menuToShow) {
        case 'actionsMenu':
          return (
            <Menu canBeReplaced items={menuItems} closeMenu={handleOnClose} />
          );
        case 'slackChannelSelectMenu':
          return (
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
          );
        case 'shareToEmailMenu':
          return (
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
          );
        default:
          return null;
      }
    }, [menuToShow, threadID, handleOnClose, menuItems]);

    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setMenuToShow((prev) => (prev ? null : 'actionsMenu'));
        setMenuShowing?.(true);
        onClick?.(event);
      },
      [onClick, setMenuShowing],
    );

    const menuVisible = Boolean(menuToShow);

    const hideMenu = useCallback(() => {
      setMenuToShow(null);
      setMenuShowing?.(false);
    }, [setMenuShowing]);

    return (
      <WithTooltip
        tooltip={<OptionsMenuTooltip canBeReplaced />}
        tooltipDisabled={menuVisible || disableTooltip}
        ref={ref}
        {...restProps}
      >
        <WithPopper
          className={cx(classes.optionsMenu, getClassName?.(menuVisible))}
          popperElement={popperElement}
          popperElementVisible={menuVisible}
          popperPosition="bottom-end"
          onShouldHide={hideMenu}
          onClick={onClickHandler}
          withBlockingOverlay={true}
        >
          {button}
        </WithPopper>
      </WithTooltip>
    );
  }),
  'OptionsMenu',
);

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
