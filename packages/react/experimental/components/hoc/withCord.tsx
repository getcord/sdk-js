import * as React from 'react'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { memo } from 'react';
import withPortal from './withPortal';
import withSDK from './withSDK';
import withCordClassname from './withCordClassname';

interface Props {
  children?: React.ReactNode;
}

// High Order Component (HOC) that adds what Cord needs.
export default function withCord<T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withSDK(withPortal(withCordClassname(memo(WrappedComponent))));
}
