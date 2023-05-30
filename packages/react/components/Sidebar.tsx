import * as React from 'react';

import type {
  HTMLCordSidebarElement,
  ScreenshotConfig,
  SidebarWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomElementRef } from '../hooks/useCustomElementRef';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomPropsRef } from '../hooks/useCustomPropsRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Sidebar,
);

export type SidebarReactComponentProps = ReactPropsWithLocation<
  {
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
    onThreadOpen?: (
      ...args: SidebarWebComponentEvents['threadopen']
    ) => unknown;
    onThreadClose?: (
      ...args: SidebarWebComponentEvents['threadclose']
    ) => unknown;
  } & { screenshotConfig?: ScreenshotConfig }
>;

type PrivateSidebarReactComponentProps = SidebarReactComponentProps & {
  newComponentSwitchConfig?: { [key: string]: boolean };
};

function SidebarWithForwardedRef(
  props: ReactPropsWithStandardHTMLAttributes<SidebarReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordSidebarElement | null>,
) {
  const { onOpen, onClose, onThreadOpen, onThreadClose } = props;

  const [ref, listenersAttached] = useCustomElementRef<
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
  const combinedSetRef = useCustomPropsRef(
    {
      newComponentSwitchConfig: (props as PrivateSidebarReactComponentProps)
        .newComponentSwitchConfig,
      screenshotConfig: props.screenshotConfig,
    },
    ref,
  );

  const location = useCordLocation();

  return (
    <cord-sidebar
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      buffer-events={!listenersAttached}
      {...propsToAttributes({ location, ...props })}
    />
  );
}

export const Sidebar = React.forwardRef<
  HTMLCordSidebarElement | null,
  SidebarReactComponentProps
>(SidebarWithForwardedRef);
