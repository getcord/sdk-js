import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import type { ComposerSize, ComposerWebComponentEvents } from '@cord-sdk/types';
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
  showExpanded?: boolean;
  showCloseButton?: boolean;
  size?: ComposerSize;
  onFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
  onClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
}>;

export function Composer(
  props: ReactPropsWithStandardHTMLAttributes<ComposerReactComponentProps>,
) {
  const setRef = useCustomEventListeners<ComposerWebComponentEvents>({
    focus: props.onFocus,
    blur: props.onBlur,
    close: props.onClose,
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
