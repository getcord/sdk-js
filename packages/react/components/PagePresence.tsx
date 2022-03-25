import React from 'react';

import {
  PagePresenceWebComponentEvents,
  PagePresenceReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordContext } from '../hooks/useCordContext';

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

  const context = useCordContext();

  return (
    <cord-page-presence
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes({
        context,
        ...props,
      })}
    />
  );
}
