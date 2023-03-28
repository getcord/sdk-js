import * as React from 'react';
import { useCallback } from 'react';

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

function SidebarWithForwardedRef(
  props: ReactPropsWithStandardHTMLAttributes<SidebarReactComponentProps>,
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
  const combinedSetRef = useCallback(
    (element: any) => {
      if (element) {
        element.screenshotConfig = props.screenshotConfig;
      }

      ref(element);
    },
    [props.screenshotConfig, ref],
  );

  const location = useCordLocation();

  return (
    <cord-sidebar
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}

export const Sidebar = React.forwardRef<
  HTMLCordSidebarElement | null,
  SidebarReactComponentProps
>(SidebarWithForwardedRef);
