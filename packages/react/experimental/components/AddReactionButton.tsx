import * as React from 'react';
import cx from 'classnames';

import { forwardRef } from 'react';
import { Button } from './helpers/Button.tsx';
import type { GeneralButtonProps } from './helpers/Button.tsx';

import withCord from './hoc/withCord.tsx';
import * as classes from '@cord-sdk/react/components/Reactions.classnames.ts';
import * as buttonClasses from '@cord-sdk/react/components/helpers/Button.classnames.ts';

export type AddReactionButtonProps = Omit<GeneralButtonProps, 'buttonAction'>;

export const AddReactionButton = withCord(
  forwardRef(function AddReactionButton(
    props: AddReactionButtonProps,
    ref?: React.ForwardedRef<HTMLButtonElement>,
  ) {
    const { className, ...restProps } = props;
    // [ONI]-TODO If `WithTooltip` was inside this component, when
    // devs replaced it, they would have to add their own tooltip.
    // If `WithTooltip` was the parent of this component, when devs
    // replaced it, they would have to make sure to pass refs and props
    // correctly for the tooltip to work.
    return (
      <Button
        canBeReplaced
        className={cx(
          className,
          classes.addReaction,
          buttonClasses.colorsSecondary,
          buttonClasses.small,
        )}
        icon="AddEmoji"
        type="button"
        {...restProps}
        buttonAction="select-emoji"
        ref={ref}
      />
    );
  }),
  'AddReactionButton',
);
