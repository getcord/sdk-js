import * as React from 'react';
import type { RefObject } from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';

import type { ClientMessageData } from '@cord-sdk/types';
import { WithPopper } from '../helpers/WithPopper.tsx';
import { useIsSlackConnected } from '../../../hooks/useIsSlackConnected.ts';
import { DefaultTooltip, WithTooltip } from '../WithTooltip.tsx';
import withCord from '../hoc/withCord.tsx';
import * as classes from '../../../components/OptionsMenu.css.ts';
import { Menu } from './Menu.tsx';
import { MessageActions } from './MessageActions.tsx';
import { ShareToEmailMenu } from './ShareToEmailMenu.tsx';
import { SlackChannelsMenu } from './SlackChannelsMenu.tsx';
import { ThreadActions } from './ThreadActions.tsx';
import { useCordTranslation } from '@cord-sdk/react';

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
  messageRef?: RefObject<HTMLDivElement>;
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
      messageRef,
      onClick,
      ...restProps
    }: OptionsMenuProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const [menuToShow, setMenuToShow] = useState<MenuTypes>(null);

    const { isOrgConnected } = useIsSlackConnected();

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
              showSeparator={showThreadOptions}
              closeMenu={handleOnClose}
              threadID={threadID}
              message={message}
              messageRef={messageRef}
            />
          ),
          name: 'message-actions-menu',
        });
      }
      return items;
    }, [
      handleOnClose,
      isOrgConnected,
      markThreadAsRead,
      message,
      messageRef,
      showThreadOptions,
      threadID,
      showMessageOptions,
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
        tooltip={<OptionsMenuTooltip />}
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
