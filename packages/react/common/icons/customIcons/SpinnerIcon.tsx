import * as React from 'react';
import cx from 'classnames';
import { Icon } from '@cord-sdk/react/components/helpers/Icon';

import classes from '@cord-sdk/react/components/helpers/Icon.css';

type Props = {
  size?: 'small' | 'large';
  className?: string;
};

export function SpinnerIcon({ size, className }: Props) {
  return (
    <Icon
      className={cx(className, classes.spinnerIcon, classes.icon)}
      name="CircleNotch"
      size={size ?? 'large'}
      aria-label="loading"
      aria-busy="true"
      aria-live="polite"
    />
  );
}
