import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { NotificationListLauncherWebComponentEvents } from '@cord-sdk/types';
import React from 'react';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';
import type { NotificationListReactComponentProps } from './NotificationList';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.NotificationListLauncher,
);

type NotificationListLauncherSpecificReactComponentProps = {
  label?: string;
  iconUrl?: string;
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
  const setRef =
    useCustomEventListeners<NotificationListLauncherWebComponentEvents>({
      click: onClick,
    });

  return (
    <cord-notification-list-launcher
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
