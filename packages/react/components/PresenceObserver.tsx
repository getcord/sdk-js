import React from 'react';

import {
  PresenceObserverWebComponentEvents,
  PresenceObserverReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordContext } from '../hooks/useCordContext';

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

  const context = useCordContext();

  return (
    <cord-presence-observer
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ context, ...props })}
    >
      {props.children}
    </cord-presence-observer>
  );
}
