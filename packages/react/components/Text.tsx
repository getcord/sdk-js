import React from 'react';

import type {
  TextWebComponentEvents,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Text);

export type TextReactComponentProps = {
  label?: string;
  color?: string;
  onBoop?: (...args: TextWebComponentEvents['boop']) => unknown;
};

export function Text(
  props: PropsWithStandardHTMLAttributes<TextReactComponentProps>,
) {
  const { onBoop } = props;
  const setRef = useCustomEventListeners<TextWebComponentEvents>({
    boop: onBoop,
  });
  return (
    <cord-text
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
