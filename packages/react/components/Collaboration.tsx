import React from 'react';

import {
  PropsWithStandardHTMLAttributes,
  CollaborationReactComponentProps,
  CollaborationWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Collaboration,
);

export function Collaboration(
  props: PropsWithStandardHTMLAttributes<CollaborationReactComponentProps>,
) {
  const setRef = useCustomEventListeners<CollaborationWebComponentEvents>({});

  return (
    <cord-collaboration
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
