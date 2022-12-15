import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  FloatingThreadsWebComponentEvents,
  HTMLCordFloatingThreadsElement,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithLocation } from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.FloatingThreads,
);

export type FloatingThreadsReactComponentProps = ReactPropsWithLocation<{
  showButton?: boolean;
  buttonLabel?: string;
  iconUrl?: string;
  threadName?: string;
  disabled?: boolean;
}>;

export function FloatingThreadsWithForwardedRef(
  props: PropsWithStandardHTMLAttributes<FloatingThreadsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordFloatingThreadsElement | null>,
) {
  const setRef = useCustomElementRef<
    FloatingThreadsWebComponentEvents,
    HTMLCordFloatingThreadsElement
  >({}, forwardedRef);

  return (
    <cord-floating-threads
      ref={setRef}
      id={props.id}
      class={props.className}
      {...propsToAttributes(props)}
    />
  );
}

export const FloatingThreads = React.forwardRef<
  HTMLCordFloatingThreadsElement | null,
  FloatingThreadsReactComponentProps
>(FloatingThreadsWithForwardedRef);
