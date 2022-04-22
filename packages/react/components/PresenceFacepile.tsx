import React from 'react';

import type {
  PresenceFacepileWebComponentEvents,
  PresenceFacepileReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordContext } from '../hooks/useCordContext';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceFacepile,
);

export function PresenceFacepile(
  props: PropsWithStandardHTMLAttributes<PresenceFacepileReactComponentProps>,
) {
  const { onUpdate } = props;
  const setRef = useCustomEventListeners<PresenceFacepileWebComponentEvents>({
    update: onUpdate,
  });

  const context = useCordContext();

  return (
    <cord-presence-facepile
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ context, ...props })}
    />
  );
}
