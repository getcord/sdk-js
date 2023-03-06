import React, { useCallback } from 'react';
import type { ThreadListWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  PropsWithRef,
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.ThreadList,
);
export type ThreadListReactComponentProps = ReactPropsWithLocation<{
  onThreadClick?: (
    ...args: ThreadListWebComponentEvents['threadclick']
  ) => unknown;
  onThreadMouseEnter?: (
    ...args: ThreadListWebComponentEvents['threadmouseenter']
  ) => unknown;
  onThreadMouseLeave?: (
    ...args: ThreadListWebComponentEvents['threadmouseleave']
  ) => unknown;
  onThreadResolve?: (
    ...args: ThreadListWebComponentEvents['threadresolve']
  ) => unknown;
  onThreadReopen?: (
    ...args: ThreadListWebComponentEvents['threadreopen']
  ) => unknown;
}>;

export function ThreadList(
  props: PropsWithRef<
    ReactPropsWithStandardHTMLAttributes<ThreadListReactComponentProps>
  >,
) {
  const setRef = useCustomEventListeners<ThreadListWebComponentEvents>({
    threadclick: props.onThreadClick,
    threadmouseenter: props.onThreadMouseEnter,
    threadmouseleave: props.onThreadMouseLeave,
    threadresolve: props.onThreadResolve,
    threadreopen: props.onThreadReopen,
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
    <cord-thread-list
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
