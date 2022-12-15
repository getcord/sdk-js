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
import type { InboxSharedReactComponentProps } from './Inbox';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.InboxLauncher,
);

// props that just affect the launcher button
type InboxLauncherSpecificReactComponentProps = {
  label?: string;
  iconUrl?: string;
  inboxBadgeStyle?: BadgeStyle;
  showInboxOnClick?: boolean;
  disabled?: boolean;
  onClick?: (...args: InboxLauncherWebComponentEvents['click']) => unknown;
};

export type InboxLauncherReactComponentProps =
  InboxLauncherSpecificReactComponentProps & InboxSharedReactComponentProps;

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
