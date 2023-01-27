import React, { useEffect } from 'react';

import type {
  FloatingThreadsWebComponentEvents,
  HTMLCordFloatingThreadsElement,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.FloatingThreads,
);

let shouldLogLoadingTime = false;
try {
  shouldLogLoadingTime = !!localStorage.getItem('__cord_log_loading_times__');
} catch {
  // localStorage for some reason not available
}

export type FloatingThreadsReactComponentProps = ReactPropsWithLocation<{
  showButton?: boolean;
  buttonLabel?: string;
  iconUrl?: string;
  threadName?: string;
  disabled?: boolean;
}>;

export function FloatingThreadsWithForwardedRef(
  props: ReactPropsWithStandardHTMLAttributes<FloatingThreadsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordFloatingThreadsElement | null>,
) {
  const setRef = useCustomElementRef<
    FloatingThreadsWebComponentEvents,
    HTMLCordFloatingThreadsElement
  >({}, forwardedRef);

  useEffect(() => {
    if (shouldLogLoadingTime) {
      console.log(
        `<cord-floating-threads> first render: ${new Date().toISOString()}`,
      );
    }
  }, []);

  return (
    <cord-floating-threads
      ref={setRef}
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    />
  );
}

export const FloatingThreads = React.forwardRef<
  HTMLCordFloatingThreadsElement | null,
  FloatingThreadsReactComponentProps
>(FloatingThreadsWithForwardedRef);
