import * as React from 'react';
import type {
  HTMLCordMultipleCursorsElement,
  MultipleCursorsWebComponentEvents,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCordLocation } from '../hooks/useCordLocation';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export type MultipleCursorsReactComponentProps =
  ReactPropsWithLocation<unknown>;

export function MultipleCursorsWithForwardedRef(
  props: ReactPropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordMultipleCursorsElement | null>,
) {
  const [ref, listenersAttached] = useCustomElementRef<
    MultipleCursorsWebComponentEvents,
    HTMLCordMultipleCursorsElement
  >({}, forwardedRef);

  const location = useCordLocation();

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      style={props.style}
      ref={ref}
      buffer-events={!listenersAttached}
      {...propsToAttributes({ location, ...props })}
    />
  );
}

export const MultipleCursors = React.forwardRef<
  HTMLCordMultipleCursorsElement | null,
  MultipleCursorsReactComponentProps
>(MultipleCursorsWithForwardedRef);
