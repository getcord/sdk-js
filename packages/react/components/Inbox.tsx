import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  InboxWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Inbox);

export type InboxReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  onCloseRequested?: (
    ...args: InboxWebComponentEvents['closeRequested']
  ) => void;
  showSettings?: boolean;
}>;

export function Inbox(
  props: PropsWithStandardHTMLAttributes<InboxReactComponentProps>,
) {
  const { onCloseRequested } = props;

  const setRef = useCustomEventListeners<InboxWebComponentEvents>({
    closeRequested: onCloseRequested,
  });

  return (
    <cord-inbox
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
