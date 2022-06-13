import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  MultipleCursorsWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export type MultipleCursorsReactComponentProps = ReactPropsWithLocation<{}>;

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
