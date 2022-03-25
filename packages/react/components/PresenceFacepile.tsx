import React from 'react';
import {
  PresenceFacepileWebComponentEvents,
  PresenceFacepileReactComponentProps,
  PropsWithStandardHTMLAttributes,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import { useCordContext } from 'opensource/cord-sdk/packages/react/hooks/useCordContext';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.PresenceFacepile,
);

export function PresenceFacepile(
  props: PropsWithStandardHTMLAttributes<PresenceFacepileReactComponentProps>,
) {
  const { onUpdate } = props;
  const setRef = useCustomEventListeners<PresenceFacepileWebComponentEvents>({
    update: onUpdate,
  });

  const context = useCordContext();

  return (
    <cord-presence-facepile
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
