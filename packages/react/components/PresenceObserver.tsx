import React from 'react';
import {
  PresenceObserverWebComponentEvents,
  PresenceObserverReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import { useCordContext } from 'opensource/cord-sdk/packages/react/hooks/useCordContext';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

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
