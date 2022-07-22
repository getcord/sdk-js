import React from 'react';

import type {
  BadgeStyle,
  InboxLauncherWebComponentEvents,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.InboxLauncher,
);

export type InboxLauncherReactComponentProps = {
  label?: string;
  iconUrl?: string;
  inboxBadgeStyle?: BadgeStyle;
  showInboxOnClick?: boolean;
  onClick?: (...args: InboxLauncherWebComponentEvents['click']) => unknown;
};

export function InboxLauncher(
  props: PropsWithStandardHTMLAttributes<InboxLauncherReactComponentProps>,
) {
  const { onClick } = props;
  const setRef = useCustomEventListeners<InboxLauncherWebComponentEvents>({
    click: onClick,
  });
  return (
    <cord-inbox-launcher
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
