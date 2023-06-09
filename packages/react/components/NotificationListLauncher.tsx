import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type {
  BadgeStyle,
  NotificationListLauncherWebComponentEvents,
} from '@cord-sdk/types';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';
import type { NotificationListReactComponentProps } from './NotificationList';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.NotificationListLauncher,
);

type NotificationListLauncherSpecificReactComponentProps = {
  label?: string;
  iconUrl?: string;
  badgeStyle?: BadgeStyle;
  disabled?: boolean;
  onClick?: (
    ...args: NotificationListLauncherWebComponentEvents['click']
  ) => unknown;
};

export type NotificationListLauncherReactComponentProps =
  NotificationListReactComponentProps &
    NotificationListLauncherSpecificReactComponentProps;

export function NotificationListLauncher(
  props: ReactPropsWithStandardHTMLAttributes<NotificationListLauncherReactComponentProps>,
) {
  const { onClick } = props;
  const [setRef, listenersAttached] =
    useCustomEventListeners<NotificationListLauncherWebComponentEvents>({
      click: onClick,
    });

  return (
    <cord-notification-list-launcher
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      buffer-events={!listenersAttached}
      {...propsToAttributes(props)}
    />
  );
}
