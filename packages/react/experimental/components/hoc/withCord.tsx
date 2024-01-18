import * as React from 'react'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { memo } from 'react';

import type { ComponentName } from '../replacements.tsx';
import withPortal from './withPortal.tsx';
import withSDK from './withSDK.tsx';
import withCordClassname from './withCordClassname.tsx';
import withReplacement from './withReplacement.tsx';

interface Props {
  children?: React.ReactNode;
}

// High Order Component (HOC) that adds what Cord needs.
export default function withCord<T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
  componentName: ComponentName,
) {
  const Component = withSDK(
    withReplacement(
      withPortal(withCordClassname(memo(WrappedComponent))),
      componentName,
    ),
  );
  Component.displayName = componentName;
  return Component;
}
