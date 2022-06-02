import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  MultipleCursorsReactComponentProps,
  MultipleCursorsWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export function MultipleCursors(
  props: PropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
) {
  const setRef = useCustomEventListeners<MultipleCursorsWebComponentEvents>({});

  const location = useCordLocation();

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
