import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.NotificationList,
);

export type NotificationListReactComponentProps = {
  maxCount?: number;
  fetchAdditionalCount?: number;
};

export function NotificationList(
  props: ReactPropsWithStandardHTMLAttributes<NotificationListReactComponentProps>,
) {
  return (
    <cord-notification-list
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    />
  );
}
