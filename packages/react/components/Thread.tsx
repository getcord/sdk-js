import React from 'react';
import {
  PropsWithStandardHTMLAttributes,
  ThreadWebComponentEvents,
  ThreadReactComponentProps,
} from 'opensource/cord-sdk/packages/types';
import { useCustomEventListeners } from 'opensource/cord-sdk/packages/react/hooks/useCustomEventListener';
import {
  componentAttributes,
  propsToAttributeConverter,
} from 'opensource/cord-sdk/packages/components';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export function Thread(
  props: PropsWithStandardHTMLAttributes<ThreadReactComponentProps>,
) {
  const { onComposerCancel, onComposerSend } = props;

  const setRef = useCustomEventListeners<ThreadWebComponentEvents>({
    composercancel: onComposerCancel,
    composersend: onComposerSend,
  });

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      ref={setRef}
      {...propsToAttributes(props)}
    />
  );
}
