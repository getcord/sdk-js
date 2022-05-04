import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  ThreadWebComponentEvents,
  ThreadReactComponentProps,
  PropsWithRef,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordContext } from '../hooks/useCordContext';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export function Thread(
  props: PropsWithRef<
    PropsWithChildren<
      PropsWithStandardHTMLAttributes<ThreadReactComponentProps>
    >
  >,
) {
  const setRef = useCustomEventListeners<ThreadWebComponentEvents>({});
  const combinedSetRef = useCallback(
    (element) => {
      if (props.forwardRef) {
        props.forwardRef.current = element;
      }
      setRef(element);
    },
    [props.forwardRef, setRef],
  );

  const context = useCordContext();

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      ref={combinedSetRef}
      {...propsToAttributes({ context, ...props })}
    >
      {props.children}
    </cord-thread>
  );
}
