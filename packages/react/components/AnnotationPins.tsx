import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  AnnotationPinsWebComponentEvents,
  HTMLCordAnnotationPinsElement,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithLocation } from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.AnnotationPins,
);

export type AnnotationPinsReactComponentProps = ReactPropsWithLocation<{}>;

export function AnnotationPinsWithForwardedRef(
  props: PropsWithStandardHTMLAttributes<AnnotationPinsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordAnnotationPinsElement | null>,
) {
  const setRef = useCustomElementRef<
    AnnotationPinsWebComponentEvents,
    HTMLCordAnnotationPinsElement
  >({}, forwardedRef);

  return (
    <cord-annotation-pins
      ref={setRef}
      id={props.id}
      class={props.className}
      {...propsToAttributes(props)}
    />
  );
}

export const AnnotationPins = React.forwardRef<
  HTMLCordAnnotationPinsElement | null,
  AnnotationPinsReactComponentProps
>(AnnotationPinsWithForwardedRef);
