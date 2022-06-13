import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  SidebarWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Sidebar,
);

export type SidebarReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  showPresence?: boolean;
  showPinsOnPage?: boolean;
  excludeViewerFromPresence?: boolean;
  showAllActivity?: boolean;
  open?: boolean;
  showLauncher?: boolean;
  onOpen?: (...args: SidebarWebComponentEvents['open']) => unknown;
  onClose?: (...args: SidebarWebComponentEvents['close']) => unknown;
}>;

export function Sidebar(
  props: PropsWithStandardHTMLAttributes<SidebarReactComponentProps>,
) {
  const { onOpen, onClose } = props;

  const setRef = useCustomEventListeners<SidebarWebComponentEvents>({
    open: onOpen,
    close: onClose,
  });

  const location = useCordLocation();

  return (
    <cord-sidebar
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
