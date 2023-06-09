// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';

import type { PinWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  PropsWithRef,
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Pin);

export type PinReactComponentProps = React.PropsWithChildren<
  ReactPropsWithLocation<{
    threadId: string;
    onResolve?: (...args: PinWebComponentEvents['resolve']) => unknown;
    onClick?: (...args: PinWebComponentEvents['click']) => unknown;
    onMouseEnter?: (...args: PinWebComponentEvents['mouseenter']) => unknown;
    onMouseLeave?: (...args: PinWebComponentEvents['mouseleave']) => unknown;
  }>
>;

export function Pin(
  props: PropsWithRef<
    PropsWithChildren<
      ReactPropsWithStandardHTMLAttributes<PinReactComponentProps>
    >
  >,
) {
  const [setRef, listenersAttached] =
    useCustomEventListeners<PinWebComponentEvents>({
      resolve: props.onResolve,
      click: props.onClick,
      mouseenter: props.onMouseEnter,
      mouseleave: props.onMouseLeave,
    });
  const combinedSetRef = useCallback(
    (element: any) => {
      if (props.forwardRef) {
        props.forwardRef.current = element;
      }
      setRef(element);
    },
    [props.forwardRef, setRef],
  );

  const location = useCordLocation();

  return (
    <cord-pin
      id={props.id}
      class={props.className}
      buffer-events={!listenersAttached}
      style={props.style}
      ref={combinedSetRef}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-pin>
  );
}
