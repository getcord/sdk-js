// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { forwardRef } from 'react';
import type { Location } from '@cord-sdk/types';

import { PresenceObserver } from '../../components/PresenceObserver';
import withCord from './hoc/withCord';
import { PresenceFacepile } from './PresenceFacepile';

export type PagePresenceProps = {
  location: Location;
  numOfAvatars?: number;
  durable?: boolean;
  excludeViewer?: boolean;
  onlyPresentUsers?: boolean;
  groupId?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const PagePresence = withCord<PagePresenceProps>(
  forwardRef(function PagePresence(
    {
      location,
      durable = true,
      excludeViewer,
      numOfAvatars,
      onlyPresentUsers,
      groupId,
      ...restProps
    }: PagePresenceProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <>
        <PresenceFacepile
          canBeReplaced
          location={location}
          excludeViewer={excludeViewer}
          onlyPresentUsers={onlyPresentUsers}
          numOfAvatars={numOfAvatars}
          ref={ref}
          {...restProps}
        />
        <PresenceObserver
          groupId={groupId}
          location={location}
          durable={durable}
          observeDocument
        />
      </>
    );
  }),
  'PagePresence',
);
