import type { HTMLProps } from 'react';
import React, { forwardRef } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import { Button } from '../../experimental.js';
import {
  colorsPrimary,
  sendButton,
  small,
} from '../../components/helpers/Button.classnames.js';

export interface SendButtonProps extends HTMLProps<HTMLButtonElement> {
  onClick: () => void;
}

export const SendButton = withCord(
  forwardRef(function SendButton(
    { onClick, className, ...restProps }: SendButtonProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    return (
      <Button
        canBeReplaced
        className={cx(className, sendButton, colorsPrimary, small)}
        buttonAction="send-message"
        onClick={onClick}
        icon="ArrowRight"
        {...restProps}
        type="button"
        ref={ref}
      />
    );
  }),
  'SendButton',
);
