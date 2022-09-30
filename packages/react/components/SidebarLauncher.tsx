import React from 'react';

import type {
  BadgeStyle,
  PropsWithStandardHTMLAttributes,
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

export type SidebarLauncherReactComponentProps = {
  disabled?: boolean;
  label?: string | null;
  iconUrl?: string | null;
  inboxBadgeStyle?: BadgeStyle;
  onClick?: (...args: SidebarLauncherWebComponentEvents['click']) => unknown;
};

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
