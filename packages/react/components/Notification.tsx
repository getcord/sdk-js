import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Notification,
);

export type NotificationReactComponentProps = {
  notificationId: string;
};

export function Notification(
  props: ReactPropsWithStandardHTMLAttributes<NotificationReactComponentProps>,
) {
  return (
    <cord-notification
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-notification>
  );
}
