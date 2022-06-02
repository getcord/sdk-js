import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  SidebarReactComponentProps,
  SidebarWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Sidebar,
);

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
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
