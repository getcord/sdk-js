import React, { forwardRef } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import { Button } from '../../experimental.js';
import type { StyleProps } from '../../experimental.js';
import {
  closeButton,
  colorsSecondary,
  small,
} from '../../components/helpers/Button.classnames.js';
import type { CommonButtonProps } from '../../experimental/components/helpers/Button.js';

export interface CloseComposerButtonProps
  extends StyleProps,
    CommonButtonProps {}

export const CloseComposerButton = withCord<
  React.PropsWithChildren<CloseComposerButtonProps>
>(
  forwardRef(function CloseButton(
    { onClick, className, ...restProps }: CloseComposerButtonProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    return (
      <Button
        canBeReplaced
        className={cx(className, closeButton, colorsSecondary, small)}
        buttonAction="close-composer"
        onClick={onClick}
        icon="X"
        {...restProps}
        ref={ref}
      />
    );
  }),
  'CloseComposerButton',
);
