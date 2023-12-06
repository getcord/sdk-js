// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';

import { useCallback } from 'react';
import { PortalContextProvider } from '../../contexts/PortalContext';

interface Props {
  children?: React.ReactNode;
}

// High Order Component (HOC) that adds Portal.
export default function withPortal<T extends Props = Props>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithPortal = React.forwardRef(
    (props: T, ref: React.ForwardedRef<HTMLDivElement>) => {
      const [portalTarget, setPortalTarget] =
        React.useState<HTMLElement | null>(null);

      const composedRef = useCallback(
        (newRef: HTMLDivElement) => {
          setPortalTarget(newRef);
          if (typeof ref === 'function') {
            ref(newRef);
          } else {
            ref && 'current' in ref && (ref.current = newRef);
          }
        },
        [ref],
      );

      return (
        <PortalContextProvider target={portalTarget}>
          <WrappedComponent ref={composedRef} {...props} />
        </PortalContextProvider>
      );
    },
  );

  ComponentWithPortal.displayName = `withPortal(${displayName})`;

  return ComponentWithPortal;
}