import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  AnnotationPinsWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.AnnotationPins,
);

export type AnnotationPinsReactComponentProps = ReactPropsWithLocation<{}>;

export function AnnotationPins(
  props: PropsWithStandardHTMLAttributes<AnnotationPinsReactComponentProps>,
) {
  const setRef = useCustomEventListeners<AnnotationPinsWebComponentEvents>({});

  return (
    <cord-annotation-pins
      ref={setRef}
      id={props.id}
      class={props.className}
      {...propsToAttributes(props)}
    />
  );
}
