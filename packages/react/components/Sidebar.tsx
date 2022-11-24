import React from 'react';

import type {
  HTMLCordSidebarElement,
  PropsWithStandardHTMLAttributes,
  SidebarWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomElementRef } from '../hooks/useCustomElementRef';
import { useCordLocation } from '../hooks/useCordLocation';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Sidebar,
);

export type SidebarReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  showInbox?: boolean;
  showPresence?: boolean;
  showPinsOnPage?: boolean;
  excludeViewerFromPresence?: boolean;
  showAllActivity?: boolean;
  open?: boolean;
  showLauncher?: boolean;
  threadName?: string;
  onOpen?: (...args: SidebarWebComponentEvents['open']) => unknown;
  onClose?: (...args: SidebarWebComponentEvents['close']) => unknown;
  onThreadOpen?: (...args: SidebarWebComponentEvents['threadopen']) => unknown;
  onThreadClose?: (
    ...args: SidebarWebComponentEvents['threadclose']
  ) => unknown;
}>;

function SidebarWithForwardedRef(
  props: PropsWithStandardHTMLAttributes<SidebarReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordSidebarElement | null>,
) {
  const { onOpen, onClose, onThreadOpen, onThreadClose } = props;

  const ref = useCustomElementRef<
    SidebarWebComponentEvents,
    HTMLCordSidebarElement
  >(
    {
      open: onOpen,
      close: onClose,
      threadopen: onThreadOpen,
      threadclose: onThreadClose,
    },
    forwardedRef,
  );

  const location = useCordLocation();

  return (
    <cord-sidebar
      id={props.id}
      class={props.className}
      ref={ref}
      {...propsToAttributes({ location, ...props })}
    />
  );
}

export const Sidebar = React.forwardRef<
  HTMLCordSidebarElement | null,
  SidebarReactComponentProps
>(SidebarWithForwardedRef);
