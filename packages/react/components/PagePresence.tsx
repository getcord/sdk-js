import React from 'react';

import type {
  Orientation,
  PagePresenceWebComponentEvents,
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
  componentAttributes.PagePresence,
);

export type PagePresenceReactComponentProps = PresenceReducerOptions & {
  durable?: boolean;
  maxUsers?: number;
  orientation?: Orientation;
  onUpdate?: (...args: PagePresenceWebComponentEvents['update']) => unknown;
};

export function PagePresence(
  props: PropsWithStandardHTMLAttributes<PagePresenceReactComponentProps>,
) {
  const { onUpdate } = props;
  const setRef = useCustomEventListeners<PagePresenceWebComponentEvents>({
    update: onUpdate,
  });

  const location = useCordLocation();

  return (
    <cord-page-presence
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
