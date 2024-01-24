import * as React from 'react';
import { useContext } from 'react';
import type { ICordSDK } from '@cord-sdk/types/index.ts';
import { CordContext } from '../../contexts/CordContext.tsx';

interface Props {
  groupId?: string;
}

interface InternalCordSDK extends ICordSDK {
  logEvent: (a: string, b: object) => void;
}

export function withGroupIDCheck<T extends Props>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string,
) {
  const Component = (props: T) => {
    const { sdk: cordSDK } = useContext(CordContext);

    if (!cordSDK) {
      return null;
    }

    if (!cordSDK.groupID && !props.groupId) {
      console.error(`${componentName}: Must specify a groupId`);
      (cordSDK as InternalCordSDK).logEvent('sdk-group-id-error', {
        componentName,
      });
      return null;
    }

    // Only error if the two groups don't match: do allow matching groups for the
    // purposes of migrations
    const groupIDSetTwice =
      cordSDK.groupID && props.groupId && cordSDK.groupID !== props.groupId;

    if (groupIDSetTwice) {
      console.error(
        `${componentName}: Must not specify a groupId on the component if the user is signed in with an access token that contains a groupId - choose one or the other. \n For more information please refer to https://docs.cord.com/reference/authentication/removing-group-from-token`,
      );
      (cordSDK as InternalCordSDK).logEvent('sdk-group-id-error', {
        propGroupID: props.groupId,
        groupID: cordSDK.groupID,
        componentName,
      });
      return null;
    }
    return <WrappedComponent {...props} />;
  };
  Component.displayName = componentName;
  return Component;
}
