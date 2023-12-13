import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';

import { Icon } from '../../../components/helpers/Icon';
import type { IconType } from '../../../components/helpers/Icon';
import * as classes from '@cord-sdk/react/components/helpers/Button.classnames';
import { MODIFIERS } from '@cord-sdk/react/common/ui/modifiers';

type AdditionalButtonProps = {
  buttonAction: string;
  type?: 'submit' | 'reset' | 'button';
  icon?: IconType | URL;
};

export type GeneralButtonProps = AdditionalButtonProps &
  React.HTMLProps<HTMLButtonElement>;

export const Button = forwardRef(function Button(
  props: GeneralButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { buttonAction, icon, children, disabled, className, ...restProps } =
    props;

  if (!children && !icon) {
    return null;
  }

  return (
    <button
      data-cord-button={buttonAction}
      aria-label={buttonAction.replaceAll('-', ' ')}
      type={'button'}
      {...restProps}
      className={cx(
        className,
        {
          [MODIFIERS.disabled]: disabled,
          [classes.icon]: !!icon,
          [classes.text]: !!children,
        },
        classes.button,
      )}
      ref={ref}
    >
      {icon instanceof URL ? (
        <img className={classes.buttonIcon} src={icon.toString()} />
      ) : (
        icon && <Icon name={icon} />
      )}
      {children && <p className={cx(classes.buttonLabel)}>{children}</p>}
    </button>
  );
});
