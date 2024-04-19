import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';
import type { ClientUserData } from '@cord-sdk/types';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../../experimental/types.js';
import { Facepile } from '../../experimental.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { useSearchUsers } from '../../hooks/user.js';
import * as classes from './EmptyThreadPlaceholder.css.js';

export type EmptyThreadPlaceholderProps = {
  users: ClientUserData[];
} & StyleProps;

export const EmptyThreadPlaceholder = withCord<
  React.PropsWithChildren<EmptyThreadPlaceholderProps>
>(
  forwardRef(function EmptyThreadPlaceholder(
    { users, className, ...restProps }: EmptyThreadPlaceholderProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('thread');
    return (
      <div
        className={cx(classes.emptyThreadPlaceholderContainer, className)}
        {...restProps}
        ref={ref}
      >
        {users.length > 0 && <Facepile users={users?.slice(0, 4)} />}
        <p className={classes.emptyThreadPlaceholderTitle}>
          {t('placeholder_title')}
        </p>
        <p className={classes.emptyThreadPlaceholderBody}>
          {t('placeholder_body')}
        </p>
      </div>
    );
  }),
  'EmptyThreadPlaceholder',
);

export function EmptyThreadPlaceholderWrapper({
  groupID,
}: {
  groupID?: string;
}) {
  const placeholderUsers = useSearchUsers({
    groupID,
    skip: !groupID,
  });

  return (
    <EmptyThreadPlaceholder
      users={placeholderUsers?.users ?? []}
      canBeReplaced
    />
  );
}
