import React from 'react';
import {
  PropsWithStandardHTMLAttributes,
  SidebarReactComponentProps,
  SidebarWebComponentEvents,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

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
