import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  ThreadWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type { PropsWithRef, ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export type ThreadReactComponentProps = ReactPropsWithLocation<{
  threadId: string;
  collapsed?: boolean;
  showHeader?: boolean;
  onThreadInfoChange?: (
    ...args: ThreadWebComponentEvents['threadinfochange']
  ) => unknown;
  onClose?: (...args: ThreadWebComponentEvents['close']) => unknown;
  onResolved?: (...args: ThreadWebComponentEvents['resolved']) => unknown;
}>;

export function Thread(
  props: PropsWithRef<
    PropsWithChildren<
      PropsWithStandardHTMLAttributes<ThreadReactComponentProps>
    >
  >,
) {
  const setRef = useCustomEventListeners<ThreadWebComponentEvents>({
    threadinfochange: props.onThreadInfoChange,
    close: props.onClose,
    resolved: props.onResolved,
  });
  const combinedSetRef = useCallback(
    (element) => {
      if (props.forwardRef) {
        props.forwardRef.current = element;
      }
      setRef(element);
    },
    [props.forwardRef, setRef],
  );

  const location = useCordLocation();

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      ref={combinedSetRef}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-thread>
  );
}
