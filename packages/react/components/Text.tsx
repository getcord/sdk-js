import React from 'react';

import type { TextWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Text);

export type TextReactComponentProps = {
  label?: string;
  color?: string;
  onBoop?: (...args: TextWebComponentEvents['boop']) => unknown;
};

export function Text(
  props: ReactPropsWithStandardHTMLAttributes<TextReactComponentProps>,
) {
  const { onBoop } = props;
  const setRef = useCustomEventListeners<TextWebComponentEvents>({
    boop: onBoop,
  });
  return (
    <cord-text
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
