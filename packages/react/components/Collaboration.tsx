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
import { useCordContext } from '../hooks/useCordContext';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Collaboration,
);

export function Collaboration(
  props: PropsWithStandardHTMLAttributes<CollaborationReactComponentProps>,
) {
  const setRef = useCustomEventListeners<CollaborationWebComponentEvents>({});

  const context = useCordContext();

  return (
    <cord-collaboration
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ context, ...props })}
    />
  );
}
