import React from 'react';

import type {
  PresenceObserverWebComponentEvents,
  PresenceObserverReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceObserver,
);

export function PresenceObserver(
  props: PropsWithStandardHTMLAttributes<PresenceObserverReactComponentProps>,
) {
  const { onChange } = props;
  const setRef = useCustomEventListeners<PresenceObserverWebComponentEvents>({
    change: onChange,
  });

  const location = useCordLocation();

  return (
    <cord-presence-observer
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-presence-observer>
  );
}
