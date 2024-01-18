import * as React from 'react';
import type { PresenceObserverWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener.ts';
import { useCordLocation } from '../hooks/useCordLocation.ts';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types.ts';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceObserver,
);

export type PresenceObserverReactComponentProps = React.PropsWithChildren<
  ReactPropsWithLocation<{
    observeDocument?: boolean;
    durable?: boolean;
    presentEvents?: string[];
    absentEvents?: string[];
    initialState?: boolean;
    groupId?: string;
    onChange?: (
      ...args: PresenceObserverWebComponentEvents['change']
    ) => unknown;
  }>
>;

export function PresenceObserver(
  props: ReactPropsWithStandardHTMLAttributes<PresenceObserverReactComponentProps>,
) {
  const { onChange } = props;
  const [setRef, listenersAttached] =
    useCustomEventListeners<PresenceObserverWebComponentEvents>({
      change: onChange,
    });

  const location = useCordLocation();

  return (
    <cord-presence-observer
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      buffer-events={!listenersAttached ? 'true' : 'false'}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-presence-observer>
  );
}
