import * as React from 'react';
import type {
  HTMLCordMultipleCursorsElement,
  MultipleCursorsWebComponentEvents,
  Location,
} from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCordLocation } from '../hooks/useCordLocation';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';
import { useCustomElementRef } from '../hooks/useCustomElementRef';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.MultipleCursors,
);

export type MultipleCursorsReactComponentProps = { location?: Location };

export function MultipleCursorsWithForwardedRef(
  {
    location,
    ...props
  }: ReactPropsWithStandardHTMLAttributes<MultipleCursorsReactComponentProps>,
  forwardedRef: React.ForwardedRef<HTMLCordMultipleCursorsElement | null>,
) {
  const [ref, listenersAttached] = useCustomElementRef<
    MultipleCursorsWebComponentEvents,
    HTMLCordMultipleCursorsElement
  >({}, forwardedRef);

  const contextLocation = useCordLocation();

  return (
    <cord-multiple-cursors
      id={props.id}
      class={props.className}
      style={props.style}
      ref={ref}
      buffer-events={!listenersAttached}
      {...propsToAttributes({
        location: location ?? contextLocation,
        ...props,
      })}
    />
  );
}

export const MultipleCursors = React.forwardRef<
  HTMLCordMultipleCursorsElement | null,
  MultipleCursorsReactComponentProps
>(MultipleCursorsWithForwardedRef);
