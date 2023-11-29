// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { PortalContext } from '../contexts/PortalContext';

export function Portal({
  children,
  target,
}: React.PropsWithChildren<{ target?: HTMLElement }>) {
  const portalContextElement = useContext(PortalContext);
  return createPortal(
    <>{children}</>,
    target ?? portalContextElement ?? document.body,
  );
}
