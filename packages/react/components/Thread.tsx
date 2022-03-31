import React from 'react';

import {
  PropsWithStandardHTMLAttributes,
  ThreadWebComponentEvents,
  ThreadReactComponentProps,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export function Thread(
  props: PropsWithStandardHTMLAttributes<ThreadReactComponentProps>,
) {
  const setRef = useCustomEventListeners<ThreadWebComponentEvents>({
    threadcreated: props.onThreadCreated,
  });

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
