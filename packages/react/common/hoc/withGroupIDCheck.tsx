import * as React from 'react';
import { useContext } from 'react';
import { CordContext } from '../../contexts/CordContext.tsx';

interface Props {
  groupId?: string;
}

export function withGroupIDCheck<T extends Props>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string,
) {
  const Component = (props: T) => {
    const { sdk: cordSDK, organizationID: tokenOrgID } =
      useContext(CordContext);

    if (!cordSDK) {
      return null;
    }

    if (!tokenOrgID && !props.groupId) {
      console.error(`${componentName}: Must specify a groupId`);
      return null;
    }

    // Only error if the two groups don't match: do allow matching groups for the
    // purposes of migrations
    const groupIDSetTwice =
      tokenOrgID && props.groupId && tokenOrgID !== props.groupId;

    if (groupIDSetTwice) {
      console.error(
        `${componentName}: Must not specify a groupId on the component if the user is signed in with an access token that contains a groupId - choose one or the other. \n For more information please refer to https://docs.cord.com/reference/authentication/removing-group-from-token`,
      );
      return null;
    }
    return <WrappedComponent {...props} />;
  };
  Component.displayName = componentName;
  return Component;
}
