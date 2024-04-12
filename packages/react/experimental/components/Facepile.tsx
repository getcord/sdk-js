import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import cx from 'classnames';
import type { ClientUserData } from '@cord-sdk/types';
import { isDefined } from '../../common/util.js';
import { useUserData } from '../../hooks/user.js';
import classes from '../../components/Facepile.css.js';
import type {
  ByID,
  StyleProps,
  WithByIDComponent,
} from '../../experimental.js';
import withCord from './hoc/withCord.js';
import { Avatar } from './avatar/Avatar.js';

export type FacepileProps = {
  users: ClientUserData[];
} & CommonFacepileProps;

export type FacepileByIDProps = {
  userIDs: string[];
} & CommonFacepileProps;

type CommonFacepileProps = { enableTooltip?: boolean } & StyleProps;

export const Facepile: WithByIDComponent<FacepileProps, FacepileByIDProps> =
  Object.assign(
    withCord<React.PropsWithChildren<FacepileProps>>(
      forwardRef(function Facepile(
        { className, users, enableTooltip = true }: FacepileProps,
        ref?: React.ForwardedRef<HTMLDivElement>,
      ) {
        const usersData = useMemo(
          () => Object.values(users).filter(isDefined),
          [users],
        );

        if (!usersData) {
          return null;
        }
        return (
          <div className={cx(classes.facepileContainer, className)} ref={ref}>
            {usersData.map((user) => (
              <Avatar
                key={user.id}
                user={user}
                enableTooltip={enableTooltip}
                canBeReplaced
              />
            ))}
          </div>
        );
      }),
      'Facepile',
    ),
    { ByID: FacepileByID },
  );

function FacepileByID(props: ByID<FacepileByIDProps>) {
  const { userIDs, ...restProps } = props;
  const usersDataById = useUserData(userIDs);

  const data = userIDs
    .map((id) => usersDataById[id])
    .filter(Boolean) as ClientUserData[];

  return <Facepile users={data} {...restProps} canBeReplaced />;
}
