import React from 'react';

import type { InboxWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

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
  props: ReactPropsWithStandardHTMLAttributes<InboxReactComponentProps>,
) {
  const { onCloseRequested } = props;

  const setRef = useCustomEventListeners<InboxWebComponentEvents>({
    closeRequested: onCloseRequested,
  });

  return (
    <cord-inbox
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
