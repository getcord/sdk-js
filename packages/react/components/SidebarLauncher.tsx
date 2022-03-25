import React from 'react';
import {
  PropsWithStandardHTMLAttributes,
  SidebarLauncherReactComponentProps,
  SidebarLauncherWebComponentEvents,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.SidebarLauncher,
);

export function SidebarLauncher(
  props: PropsWithStandardHTMLAttributes<SidebarLauncherReactComponentProps>,
) {
  const { onClick } = props;

  const setRef = useCustomEventListeners<SidebarLauncherWebComponentEvents>({
    click: onClick,
  });

  return (
    <cord-sidebar-launcher
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
