import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  AnchoredThreadsWebComponentEvents,
  HTMLCordAnchoredThreadsElement,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithLocation } from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.AnchoredThreads,
);

export type AnchoredThreadsReactComponentProps = ReactPropsWithLocation<{
  showButton?: boolean;
  buttonLabel?: string;
}>;

export function AnchoredThreadsWithForwardedRef(
  props: PropsWithStandardHTMLAttributes<AnchoredThreadsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordAnchoredThreadsElement | null>,
) {
  const setRef = useCustomElementRef<
    AnchoredThreadsWebComponentEvents,
    HTMLCordAnchoredThreadsElement
  >({}, forwardedRef);

  return (
    <cord-anchored-threads
      ref={setRef}
      id={props.id}
      class={props.className}
      {...propsToAttributes(props)}
    />
  );
}

export const AnchoredThreads = React.forwardRef<
  HTMLCordAnchoredThreadsElement | null,
  AnchoredThreadsReactComponentProps
>(AnchoredThreadsWithForwardedRef);
