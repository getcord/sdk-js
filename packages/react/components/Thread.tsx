import type { PropsWithChildren } from 'react';
import * as React from 'react';
import { useCallback } from 'react';

import type {
  ComposerWebComponentEvents,
  ThreadWebComponentEvents,
} from '@cord-sdk/types';
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

const propsToAttributes = propsToAttributeConverter(componentAttributes.Thread);

export type ThreadReactComponentProps = ReactPropsWithLocation<{
  threadId: string;
  threadName?: string;
  collapsed?: boolean;
  autofocus?: boolean;
  showHeader?: boolean;
  composerExpanded?: boolean;
  onThreadInfoChange?: (
    ...args: ThreadWebComponentEvents['threadinfochange']
  ) => unknown;
  onClose?: (...args: ThreadWebComponentEvents['close']) => unknown;
  onResolved?: (...args: ThreadWebComponentEvents['resolved']) => unknown;
  onRender?: (...args: ThreadWebComponentEvents['render']) => unknown;
  onLoading?: (...args: ThreadWebComponentEvents['loading']) => unknown;
  onFocusComposer?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onBlurComposer?: (...args: ComposerWebComponentEvents['blur']) => unknown;
}>;

export function Thread(
  props: PropsWithRef<
    PropsWithChildren<
      ReactPropsWithStandardHTMLAttributes<ThreadReactComponentProps>
    >
  >,
) {
  let setRef = useCustomEventListeners<ThreadWebComponentEvents>({
    threadinfochange: props.onThreadInfoChange,
    close: props.onClose,
    resolved: props.onResolved,
    render: props.onRender,
    loading: props.onLoading,
  });

  setRef = useCustomEventListeners<ComposerWebComponentEvents>(
    {
      focus: props.onFocusComposer,
      blur: props.onBlurComposer,
    },
    'cord-composer',
  );
  const combinedSetRef = useCallback(
    (element) => {
      if (props.forwardRef) {
        props.forwardRef.current = element;
      }
      setRef(element);
    },
    [props.forwardRef, setRef],
  );

  const location = useCordLocation();

  return (
    <cord-thread
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-thread>
  );
}
