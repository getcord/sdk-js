import React from 'react';

import {
  PropsWithStandardHTMLAttributes,
  MultipleCursorsReactComponentProps,
  MultipleCursorsWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export function MultipleCursors(
  props: PropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
) {
  const setRef = useCustomEventListeners<MultipleCursorsWebComponentEvents>({});

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
