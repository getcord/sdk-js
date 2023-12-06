// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';

import { useContext } from 'react';
import { CordContext } from '../../../contexts/CordContext';

interface Props {
  children?: React.ReactNode;
}

// High Order Component (HOC) that checks if Cord SDK is loaded and renders null if none.
export default function withSDK<T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSDK = React.forwardRef(
    (props: T, ref: React.ForwardedRef<HTMLDivElement>) => {
      const { sdk: cordSDK } = useContext(CordContext);
      if (!cordSDK) {
        return null;
      }
      return <WrappedComponent ref={ref} {...props} />;
    },
  );

  ComponentWithSDK.displayName = `withSDK(${displayName})`;

  return ComponentWithSDK;
}