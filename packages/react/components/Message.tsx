import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import React from 'react';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Message,
);

export type MessageReactComponentProps = {
  threadId: string;
  messageId?: string;
};

export function Message(
  props: ReactPropsWithStandardHTMLAttributes<MessageReactComponentProps>,
) {
  return (
    <cord-message
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-message>
  );
}
