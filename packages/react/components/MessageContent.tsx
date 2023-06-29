import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MessageContent,
);

export type MessageContentReactComponentProps = {
  threadId: string;
  messageId?: string;
};

export function MessageContent(
  props: ReactPropsWithStandardHTMLAttributes<MessageContentReactComponentProps>,
) {
  return (
    <cord-message-content
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-message-content>
  );
}
