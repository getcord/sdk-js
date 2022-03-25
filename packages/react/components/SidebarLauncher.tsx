import React from 'react';

import {
  PropsWithStandardHTMLAttributes,
  SidebarLauncherReactComponentProps,
  SidebarLauncherWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

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
