import * as React from 'react';
import { forwardRef, useCallback, useMemo } from 'react';
import cx from 'classnames';
import withCord from '../hoc/withCord.js';
import * as classes from '../../../components/Menu.css.js';
import type { StyleProps } from '../../../experimental/types.js';
import { DefaultTooltip, WithTooltip } from '../WithTooltip.js';
import { WithPopper } from '../helpers/WithPopper.js';

// We need more than just the `element`, so we can manipulate items more easily
// including filtering out items or adding more items
export type MenuItem = {
  name: string;
  element: JSX.Element;
};

export type MenuProps = {
  items: MenuItem[];
  closeMenu: () => void;
} & React.HTMLAttributes<HTMLOListElement>;

export const Menu = withCord<React.PropsWithChildren<MenuProps>>(
  forwardRef(function Menu(
    { className, items, onClick, ...restProps }: MenuProps,
    ref: React.ForwardedRef<HTMLOListElement>,
  ) {
    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLOListElement>) => {
        event.stopPropagation();
        onClick?.(event);
      },
      [onClick],
    );

    return (
      <ol
        ref={ref}
        className={cx(classes.menu, className)}
        onClick={onClickHandler}
        {...restProps}
      >
        {items.map((item) => (
          <React.Fragment key={item.name}>{item.element}</React.Fragment>
        ))}
      </ol>
    );
  }),
  'Menu',
);

export type MenuButtonProps = {
  button: JSX.Element;
  menuItems: MenuItem[];
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  buttonTooltipLabel: string;
  disableButtonTooltip?: boolean;
} & StyleProps;

export const MenuButton = withCord<React.PropsWithChildren<MenuButtonProps>>(
  forwardRef<HTMLElement, MenuButtonProps>(function MenuButton(
    {
      button,
      style,
      className,
      buttonTooltipLabel,
      menuItems,
      menuVisible,
      setMenuVisible,
      disableButtonTooltip,
      ...restProps
    },
    ref,
  ) {
    const showMenu = useCallback(() => {
      setMenuVisible(true);
    }, [setMenuVisible]);

    const hideMenu = useCallback(() => {
      setMenuVisible(false);
    }, [setMenuVisible]);

    const popperElement = useMemo(() => {
      return <Menu canBeReplaced items={menuItems} closeMenu={hideMenu} />;
    }, [hideMenu, menuItems]);

    if (menuItems.length === 0) {
      return null;
    }

    return (
      <WithTooltip
        tooltip={<MenuButtonTooltip label={buttonTooltipLabel} />}
        tooltipDisabled={menuVisible || disableButtonTooltip}
        ref={ref}
        {...restProps}
      >
        <WithPopper
          className={className}
          style={style}
          popperElement={popperElement}
          popperElementVisible={menuVisible}
          popperPosition="bottom-end"
          onShouldHide={hideMenu}
          onClick={showMenu}
          withBlockingOverlay={true}
        >
          {button}
        </WithPopper>
      </WithTooltip>
    );
  }),
  'MenuButton',
);

export type MenuButtonTooltipProps = { label: string } & StyleProps;
export const MenuButtonTooltip = withCord<
  React.PropsWithChildren<MenuButtonTooltipProps>
>(
  forwardRef(function OptionsMenuTooltip(
    { label, ...rest }: MenuButtonTooltipProps,
    _ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    return <DefaultTooltip {...rest} label={label} />;
  }),
  'OptionsMenuTooltip',
);
