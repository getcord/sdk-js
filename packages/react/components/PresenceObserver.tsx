import React from 'react';

import type {
  PresenceObserverWebComponentEvents,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type { ReactPropsWithLocation } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceObserver,
);

export type PresenceObserverReactComponentProps = React.PropsWithChildren<
  ReactPropsWithLocation<{
    element?: Element;
    observeDocument?: boolean;
    durable?: boolean;
    presentEvents?: string[];
    absentEvents?: string[];
    initialState?: boolean;
    onChange?: (
      ...args: PresenceObserverWebComponentEvents['change']
    ) => unknown;
  }>
>;

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
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-presence-observer>
  );
}
