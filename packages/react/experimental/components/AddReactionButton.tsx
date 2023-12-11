// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { forwardRef } from 'react';
import { Button } from './helpers/Button';
import type { GeneralButtonProps } from './helpers/Button';

import * as classes from '@cord-sdk/react/components/Reactions.classnames';

export const AddReactionButton = forwardRef(function AddReactionButton(
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
});
