import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type {
  BadgeStyle,
  NotificationListLauncherWebComponentEvents,
  NotificationWebComponentEvents,
} from '@cord-sdk/types';
import { useCustomEventListeners } from '../hooks/useCustomEventListener.ts';
import type {
  PropsWithFlags,
  ReactPropsWithStandardHTMLAttributes,
} from '../types.ts';
import { useComposedRefs } from '../common/lib/composeRefs.ts';
import type { NotificationListReactComponentProps } from './NotificationList.tsx';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.NotificationListLauncher,
);

type NotificationListLauncherSpecificReactComponentProps = PropsWithFlags<{
  label?: string;
  iconUrl?: string;
  /** @deprecated Use plain CSS instead, targeting `cord-badge`. */
  badgeStyle?: BadgeStyle;
  disabled?: boolean;
  onClick?: (
    ...args: NotificationListLauncherWebComponentEvents['click']
  ) => unknown;
  onClickNotification?: (
    ...args: NotificationWebComponentEvents['click']
  ) => unknown;
}>;

export type NotificationListLauncherReactComponentProps =
  NotificationListReactComponentProps &
    NotificationListLauncherSpecificReactComponentProps;

export function NotificationListLauncher(
  props: ReactPropsWithStandardHTMLAttributes<NotificationListLauncherReactComponentProps>,
) {
  const { onClick, onClickNotification } = props;
  const [
    notificationListLauncherRef,
    notificationListLauncherListenersAttached,
  ] = useCustomEventListeners<NotificationListLauncherWebComponentEvents>({
    click: onClick,
  });
  const [notificationRef, notificationListenersAttached] =
    useCustomEventListeners<NotificationWebComponentEvents>(
      {
        click: onClickNotification,
      },
      'cord-notification',
    );

  const combinedSetRef = useComposedRefs<Element | null>(
    notificationListLauncherRef,
    notificationRef,
  );

  return (
    <cord-notification-list-launcher
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      buffer-events={
        !notificationListLauncherListenersAttached ||
        !notificationListenersAttached
          ? 'true'
          : 'false'
      }
      use-shadow-root={props.useShadowRoot ? 'true' : 'false'}
      {...propsToAttributes(props)}
    />
  );
}
