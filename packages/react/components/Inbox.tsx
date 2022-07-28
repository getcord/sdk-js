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

const propsToAttributes = propsToAttributeConverter(componentAttributes.Inbox);

// i.e. those props exposed to both plain Inbox and Inbox via InboxLauncher
export type InboxSharedReactComponentProps = {
  showSettings?: boolean;
};

// but these props are only available for a directly implemented <Inbox/>
export type InboxSpecificReactComponentProps = {
  showCloseButton?: boolean;
  onCloseRequested?: (
    ...args: InboxWebComponentEvents['closeRequested']
  ) => void;
};

export type InboxReactComponentProps = InboxSharedReactComponentProps &
  InboxSpecificReactComponentProps;

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
