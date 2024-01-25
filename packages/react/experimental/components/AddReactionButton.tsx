import * as React from 'react';
import { forwardRef } from 'react';
import { Button } from './helpers/Button.tsx';
import type { GeneralButtonProps } from './helpers/Button.tsx';

import withCord from './hoc/withCord.tsx';
import * as classes from '@cord-sdk/react/components/Reactions.classnames.ts';

export const AddReactionButton = withCord(
  forwardRef(function AddReactionButton(
    props: Omit<GeneralButtonProps, 'buttonAction'>,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    return (
      <Button
        canBeReplaced
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
