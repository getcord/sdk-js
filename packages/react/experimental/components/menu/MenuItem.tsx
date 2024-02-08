import * as React from 'react';

import { forwardRef } from 'react';
import cx from 'classnames';
import type { Avatar } from '../Avatar.tsx';
import * as classes from '../../../components/MenuItem.css.ts';
import withCord from '../hoc/withCord.tsx';
import { Icon } from '../../../components/helpers/Icon.tsx';
import type { IconType } from '../../../components/helpers/Icon.tsx';
import type { ColorVar } from '../../../common/ui/cssVariables.ts';
import type { Font } from '../../../common/ui/atomicClasses/fonts.ts';
import { fontBody } from '../../../common/ui/atomicClasses/fonts.css.ts';

import { MODIFIERS } from '../../../common/ui/modifiers.ts';

type LeftItem = React.ReactElement<typeof Avatar | typeof Icon>;

export type MenuItemProps = {
  disabled?: boolean;
  selected?: boolean;
  menuItemAction: string;
  label: string;
  iconAfterLabel?: IconType;
  labelFontStyle?: Font;
  labelColorOverride?: ColorVar;
  leftItem?: LeftItem;
  subtitle?: string;
} & React.HTMLAttributes<HTMLLIElement>;

export const MenuItem = withCord<MenuItemProps>(
  forwardRef(function MenuItem(
    props: MenuItemProps,
    ref: React.Ref<HTMLLIElement>,
  ) {
    const {
      className,
      menuItemAction,
      label,
      disabled,
      iconAfterLabel,
      selected,
      leftItem,
      subtitle,
      ...restProps
    } = props;

    return (
      <li
        {...restProps}
        data-cord-menu-item={menuItemAction}
        className={cx(classes.listItemContainer, className)}
        ref={ref}
      >
        <button
          className={cx(classes.base, {
            [classes.textOnly]: !leftItem,
            [MODIFIERS.selected]: selected,
          })}
          disabled={disabled}
          type="button"
        >
          {leftItem ?? null}
          <p className={cx(classes.label, fontBody)}>{label}</p>
          {iconAfterLabel && (
            <Icon
              color="content-secondary"
              size="small"
              name={iconAfterLabel}
            />
          )}
          {subtitle && (
            <p className={cx(classes.subtitle, fontBody)}>{subtitle}</p>
          )}
        </button>
      </li>
    );
  }),
  'MenuItem',
);
