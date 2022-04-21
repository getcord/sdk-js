import React, { PropsWithChildren } from 'react';

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
import { useCordContext } from '../hooks/useCordContext';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export function Thread(
  props: PropsWithChildren<
    PropsWithStandardHTMLAttributes<ThreadReactComponentProps>
  >,
) {
  const setRef = useCustomEventListeners<ThreadWebComponentEvents>({
    threadcreated: props.onThreadCreated,
  });

  const context = useCordContext();

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ context, ...props })}
    >
      {props.children}
    </cord-thread>
  );
}
