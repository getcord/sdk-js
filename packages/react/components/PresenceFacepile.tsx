import React from 'react';

import type {
  PresenceFacepileWebComponentEvents,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type { PresenceReducerOptions } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceFacepile,
);

export type PresenceFacepileReactComponentProps = PresenceReducerOptions & {
  maxUsers?: number;
  onUpdate?: (...args: PresenceFacepileWebComponentEvents['update']) => unknown;
};

export function PresenceFacepile(
  props: PropsWithStandardHTMLAttributes<PresenceFacepileReactComponentProps>,
) {
  const { onUpdate } = props;
  const setRef = useCustomEventListeners<PresenceFacepileWebComponentEvents>({
    update: onUpdate,
  });

  const location = useCordLocation();

  return (
    <cord-presence-facepile
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
