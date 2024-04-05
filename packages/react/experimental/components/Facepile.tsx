import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import cx from 'classnames';
import { isDefined } from '../../common/util.js';
import { useUserData } from '../../hooks/user.js';
import classes from '../../components/Facepile.css.js';
import withCord from './hoc/withCord.js';
import { Avatar } from './avatar/Avatar.js';

export type FacepileProps = {
  userIDs: string[];
  enableTooltip?: boolean;
  className?: string;
};

export const Facepile = withCord<React.PropsWithChildren<FacepileProps>>(
  forwardRef(function Facepile(
    { className, userIDs, enableTooltip = true }: FacepileProps,
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
          <Avatar
            key={userID}
            userId={userID}
            enableTooltip={enableTooltip}
            canBeReplaced
          />
        ))}
      </div>
    );
  }),
  'Facepile',
);
