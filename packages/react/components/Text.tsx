import React from 'react';
import {
  TextWebComponentEvents,
  TextReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Text);

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
