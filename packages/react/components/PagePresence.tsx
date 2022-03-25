import React from 'react';
import {
  PagePresenceWebComponentEvents,
  PagePresenceReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import { useCordContext } from 'opensource/cord-sdk/packages/react/hooks/useCordContext';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

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
