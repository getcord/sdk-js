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
import { useCordContext } from '../hooks/useCordContext';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export function MultipleCursors(
  props: PropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
) {
  const setRef = useCustomEventListeners<MultipleCursorsWebComponentEvents>({});

  const context = useCordContext();

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ context, ...props })}
    />
  );
}
