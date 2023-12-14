import * as React from 'react';
import { forwardRef } from 'react';
import { Button } from './helpers/Button';
import type { GeneralButtonProps } from './helpers/Button';

import withCord from './hoc/withCord';
import * as classes from '@cord-sdk/react/components/Reactions.classnames';

export const AddReactionButton = withCord(
  forwardRef(function AddReactionButton(
    props: Omit<GeneralButtonProps, 'buttonAction'>,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    return (
      <Button
        className={classes.addReaction}
        icon="AddEmoji"
        type="button"
        {...props}
        buttonAction="select-emoji"
        ref={ref}
      />
    );
  }),
  'AddReactionButton',
);
