import React from 'react';

import {
  PropsWithStandardHTMLAttributes,
  SidebarReactComponentProps,
  SidebarWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

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

  return (
    <cord-sidebar
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
