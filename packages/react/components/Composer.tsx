import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import type { ComposerSize, ComposerWebComponentEvents } from '@cord-sdk/types';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  PropsWithFlags,
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCustomPropsRef } from '../hooks/useCustomPropsRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Composer,
);

export type ComposerReactComponentProps = PropsWithFlags<
  ReactPropsWithLocation<{
    threadId?: string;
    threadName?: string;
    autofocus?: boolean;
    showExpanded?: boolean;
    showCloseButton?: boolean;
    size?: ComposerSize;
    onFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
    onBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
    onClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
  }>
>;

type PrivateComposerReactComponentProps = ComposerReactComponentProps & {
  newComponentSwitchConfig?: { [key: string]: boolean };
};

export function Composer(
  props: ReactPropsWithStandardHTMLAttributes<ComposerReactComponentProps>,
) {
  const [setRef, listenersAttached] =
    useCustomEventListeners<ComposerWebComponentEvents>({
      focus: props.onFocus,
      blur: props.onBlur,
      close: props.onClose,
    });

  const combinedSetRef = useCustomPropsRef(
    {
      newComponentSwitchConfig: (props as PrivateComposerReactComponentProps)
        .newComponentSwitchConfig,
    },
    setRef,
  );

  const location = useCordLocation();

  return (
    <cord-composer
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      buffer-events={!listenersAttached}
      use-shadow-root={props.useShadowRoot ?? false}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
