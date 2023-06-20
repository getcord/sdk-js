import * as React from 'react';

import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.ReactionList,
);

export type ReactionListReactComponentProps = {
  threadId?: string;
  messageId?: string;
  showAddReactionButton?: boolean;
};

export function ReactionList(
  props: ReactPropsWithStandardHTMLAttributes<ReactionListReactComponentProps>,
) {
  return (
    <cord-reaction-list
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-reaction-list>
  );
}
