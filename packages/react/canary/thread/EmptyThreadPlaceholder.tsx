import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import cx from 'classnames';
import type { ClientThreadData, ClientUserData } from '@cord-sdk/types';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import type { StyleProps } from '../../experimental/types.js';
import { Facepile } from '../../betaV2.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { useSearchUsers } from '../../hooks/user.js';
import * as classes from './EmptyThreadPlaceholder.css.js';

export type EmptyThreadPlaceholderProps = {
  users: ClientUserData[];
  hide?: boolean;
} & StyleProps &
  MandatoryReplaceableProps;

export const EmptyThreadPlaceholder = withCord<
  React.PropsWithChildren<EmptyThreadPlaceholderProps>
>(
  forwardRef(function EmptyThreadPlaceholder(
    { users, hide, className, ...restProps }: EmptyThreadPlaceholderProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('thread');

    if (hide) {
      return null;
    }

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
  threadData,
}: {
  groupID?: string;
  threadData?: ClientThreadData;
}) {
  const placeholderUsers = useSearchUsers({
    groupID,
    skip: !groupID,
  });

  const thread = useMemo(() => threadData?.thread, [threadData?.thread]);
  const messages = useMemo(
    () => threadData?.messages ?? [],
    [threadData?.messages],
  );

  const hide =
    (threadData?.loading && messages.length === 0) || thread !== null;

  return (
    <EmptyThreadPlaceholder
      users={placeholderUsers?.users ?? []}
      hide={hide}
      canBeReplaced
    />
  );
}
