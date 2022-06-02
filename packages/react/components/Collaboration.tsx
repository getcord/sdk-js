import React from 'react';

import type {
  PropsWithStandardHTMLAttributes,
  CollaborationReactComponentProps,
  CollaborationWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Collaboration,
);

export function Collaboration(
  props: PropsWithStandardHTMLAttributes<CollaborationReactComponentProps>,
) {
  const setRef = useCustomEventListeners<CollaborationWebComponentEvents>({});

  const location = useCordLocation();

  return (
    <cord-collaboration
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
