import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { NotificationListFilter } from '@cord-sdk/types';
import type {
  PropsWithFlags,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.NotificationList,
);

export type NotificationListReactComponentProps = PropsWithFlags<{
  maxCount?: number;
  fetchAdditionalCount?: number;
  showPlaceholder?: boolean;
  filter?: NotificationListFilter;
}>;

export function NotificationList(
  props: ReactPropsWithStandardHTMLAttributes<NotificationListReactComponentProps>,
) {
  return (
    <cord-notification-list
      id={props.id}
      class={props.className}
      style={props.style}
      use-shadow-root={props.useShadowRoot ?? false}
      {...propsToAttributes(props)}
    />
  );
}
