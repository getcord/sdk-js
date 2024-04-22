import * as React from 'react';
import { useMemo } from 'react';
import cx from 'classnames';

import type { FormatStyle } from '@cord-sdk/types';
import { MessageNodeType } from '@cord-sdk/types';
import * as classes from '../../../components/composer/userReferences/UserReferenceElement.css.js';
import { useUserData } from '../../../hooks/user.js';
import withCord from '../hoc/withCord.js';
import type { StyleProps } from '../../../betaV2.js';

export type MessageUserReferenceElementProps = {
  userID: string;
  referencedUserData: { id: string; name: string | null }[];
  nodeType: MessageNodeType.ASSIGNEE | MessageNodeType.MENTION;
  formatStyle: FormatStyle;
} & StyleProps;

export const MessageUserReferenceElement = withCord<
  React.PropsWithChildren<MessageUserReferenceElementProps>
>(
  React.forwardRef(function MessageUserReferenceElement(
    {
      userID,
      referencedUserData,
      nodeType,
      formatStyle,
      className,
      ...restProps
    }: MessageUserReferenceElementProps,
    ref: React.ForwardedRef<HTMLSpanElement>,
  ) {
    const memoizedUserData = useMemo(
      () => referencedUserData.find(({ id }) => id === userID),
      [userID, referencedUserData],
    );

    const user = useUserData(userID);
    const prefix = nodeType === MessageNodeType.MENTION ? '@' : '+';
    // We can have referenced users that the caller can't see all the data for, so
    // we access the user info if we have it but fall back to the
    // referencedUserData value if not. If the user is deleted, we may not have
    // anything at all, so finally fall back to a fixed string in that case.
    const name = user?.displayName ?? memoizedUserData?.name ?? 'Unknown User';

    return formatStyle === 'normal' ? (
      <span
        className={cx(classes.userReferenceElement, className)}
        ref={ref}
        {...restProps}
      >
        {prefix}
        <span className={classes.userDisplayName}>{name}</span>
      </span>
    ) : (
      <span ref={ref} className={className} {...restProps}>
        {name}
      </span>
    );
  }),
  'MessageUserReferenceElement',
);
