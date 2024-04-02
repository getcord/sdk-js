import * as React from 'react';
import { forwardRef } from 'react';
import withCord from '../hoc/withCord.js';
import classes from '../../../components/Avatar.css.js';
import type { AvatarFallbackProps } from '../../../experimental.js';

export const AvatarFallback = withCord<
  React.PropsWithChildren<AvatarFallbackProps>
>(
  forwardRef(function AvatarFallback(
    { userData: user }: AvatarFallbackProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { displayName } = user;
    return (
      <div ref={ref} className={classes.avatarFallback}>
        {displayName[0].toUpperCase()}
      </div>
    );
  }),
  'AvatarFallback',
);
