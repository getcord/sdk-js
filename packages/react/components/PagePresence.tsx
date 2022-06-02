import React from 'react';

import type {
  PagePresenceWebComponentEvents,
  PagePresenceReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PagePresence,
);

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
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
