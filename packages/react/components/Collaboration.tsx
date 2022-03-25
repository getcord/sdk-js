import React from 'react';
import {
  PropsWithStandardHTMLAttributes,
  CollaborationReactComponentProps,
  CollaborationWebComponentEvents,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

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
