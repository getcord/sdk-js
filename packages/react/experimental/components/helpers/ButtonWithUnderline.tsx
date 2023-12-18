import * as React from 'react';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import cx from 'classnames';

import { Button } from './Button';
import * as classes from '@cord-sdk/react/components/helpers/ButtonWithUnderline.classnames';
import type { IconType } from '@cord-sdk/react/components/helpers/Icon';
import { Icon } from '@cord-sdk/react/components/helpers/Icon';

type ButtonWithUnderlineProps = {
  /** This helps writing CSS selectors to target the right buttons */
  buttonAction: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
  className?: string;
  iconName?: IconType;
  iconPosition?: 'start' | 'end';
} & HTMLAttributes<HTMLButtonElement>;

export const ButtonWithUnderline = forwardRef(function ButtonWithUnderline(
  {
    buttonAction,
    label,
    onClick,
    className,
    iconName,
    iconPosition = 'end',
    ...restProps
  }: ButtonWithUnderlineProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      ref={ref}
      buttonAction={buttonAction}
      onClick={onClick}
      className={cx(className, classes.buttonWithUnderline)}
      {...restProps}
    >
      {iconName && iconPosition === 'start' && <Icon name={iconName} />}
      <p className={classes.buttonText}>{label}</p>
      {iconName && iconPosition === 'end' && <Icon name={iconName} />}
    </Button>
  );
});
