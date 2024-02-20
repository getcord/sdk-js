import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';

import { Icon } from '../../../components/helpers/Icon.js';
import type { IconType } from '../../../components/helpers/Icon.js';
import withCord from '../hoc/withCord.js';
import * as classes from '../../../components/helpers/Button.classnames.js';
import { MODIFIERS } from '../../../common/ui/modifiers.js';

type AdditionalButtonProps = {
  buttonAction: string;
  type?: 'submit' | 'reset' | 'button';
  icon?: IconType | URL;
};

export type GeneralButtonProps = AdditionalButtonProps &
  React.HTMLProps<HTMLButtonElement>;

export const Button = withCord(
  forwardRef(function Button(
    props: GeneralButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { buttonAction, icon, children, className, ...htmlProps } = props;

    if (!children && !icon) {
      return null;
    }

    return (
      <button
        data-cord-button={buttonAction}
        aria-label={buttonAction.replaceAll('-', ' ')}
        type="button"
        {...htmlProps}
        className={cx(
          className,
          {
            [MODIFIERS.disabled]: htmlProps.disabled,
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
  }),
  'Button',
);
