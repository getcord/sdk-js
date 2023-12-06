// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import cx from 'classnames';
import { isDefined } from '../../common/util';
import { useUserData } from '../../hooks/user';
import { Avatar } from './Avatar';
import withCord from './hoc/withCord';
import * as classes from '@cord-sdk/react/components/Facepile.classnames';

type FacepileReactComponentProps = {
  userIDs: string[];
  enableTooltip?: boolean;
  className?: string;
};

export const Facepile = withCord<
  React.PropsWithChildren<FacepileReactComponentProps>
>(
  forwardRef(function Facepile(
    { className, userIDs, enableTooltip = true }: FacepileReactComponentProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const usersDataById = useUserData(userIDs);
    const usersData = useMemo(
      () => Object.values(usersDataById).filter(isDefined),
      [usersDataById],
    );

    if (!usersData) {
      return null;
    }
    return (
      <div className={cx(classes.facepileContainer, className)} ref={ref}>
        {userIDs.map((userID) => (
          <Avatar key={userID} userId={userID} enableTooltip={enableTooltip} />
        ))}
      </div>
    );
  }),
);
