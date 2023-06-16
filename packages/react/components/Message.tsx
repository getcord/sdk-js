import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type {
  PropsWithFlags,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Message,
);

export type MessageReactComponentProps = PropsWithFlags<{
  threadId: string;
  messageId?: string;
  markAsSeen?: boolean;
}>;

export function Message(
  props: ReactPropsWithStandardHTMLAttributes<MessageReactComponentProps>,
) {
  return (
    <cord-message
      id={props.id}
      class={props.className}
      style={props.style}
      use-shadow-root={props.useShadowRoot ?? false}
      {...propsToAttributes(props)}
    ></cord-message>
  );
}
