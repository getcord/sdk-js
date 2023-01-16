import React from 'react';

import type { MultipleCursorsWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export type MultipleCursorsReactComponentProps =
  ReactPropsWithLocation<unknown>;

export function MultipleCursors(
  props: ReactPropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
) {
  const setRef = useCustomEventListeners<MultipleCursorsWebComponentEvents>({});

  const location = useCordLocation();

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
