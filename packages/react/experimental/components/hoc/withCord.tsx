import * as React from 'react'; // eslint-disable-line @typescript-eslint/consistent-type-imports

import { memo } from 'react';

import type { ComponentName } from '../replacements.js';
import withPortal from './withPortal.js';
import withErrorBoundary from './withErrorBoundary.js';
import withCordClassname from './withCordClassname.js';
import withReplacement from './withReplacement.js';

interface Props {
  children?: React.ReactNode;
}

// High Order Component (HOC) that adds what Cord needs.
export default function withCord<T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
  componentName: ComponentName,
) {
  const Component = withReplacement(
    withPortal(withCordClassname(withErrorBoundary(memo(WrappedComponent)))),
    componentName,
  );
  Component.displayName = componentName;
  return Component;
}
