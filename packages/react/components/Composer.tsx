import React from 'react';

import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import type { ComposerWebComponentEvents } from '@cord-sdk/types';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Composer,
);

export type ComposerReactComponentProps = ReactPropsWithLocation<{
  threadId?: string;
  threadName?: string;
  autofocus?: boolean;
  onFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
}>;

export function Composer(
  props: ReactPropsWithStandardHTMLAttributes<ComposerReactComponentProps>,
) {
  const setRef = useCustomEventListeners<ComposerWebComponentEvents>({
    focus: props.onFocus,
    blur: props.onBlur,
  });

  const location = useCordLocation();

  return (
    <cord-composer
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
