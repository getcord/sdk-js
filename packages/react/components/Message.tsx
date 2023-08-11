import * as React from 'react';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { MessageWebComponentEvents } from '@cord-sdk/types';
import type {
  PropsWithRef,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';
import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useComposedRefs } from '../common/lib/composeRefs';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Message,
);

export type MessageReactComponentProps = {
  threadId: string;
  messageId?: string;
  markAsSeen?: boolean;
  onClick?: (...args: MessageWebComponentEvents['click']) => unknown;
  onMouseEnter?: (...args: MessageWebComponentEvents['mouseenter']) => unknown;
  onMouseLeave?: (...args: MessageWebComponentEvents['mouseleave']) => unknown;
  onRender?: (...args: MessageWebComponentEvents['render']) => unknown;
  onLoading?: (...args: MessageWebComponentEvents['loading']) => unknown;
  isEditing?: boolean;
  onEditStart?: (...args: MessageWebComponentEvents['editstart']) => unknown;
  onEditEnd?: (...args: MessageWebComponentEvents['editend']) => unknown;
};

export function Message(
  props: PropsWithRef<
    ReactPropsWithStandardHTMLAttributes<MessageReactComponentProps>
  >,
) {
  const [setRef, listenersAttached] =
    useCustomEventListeners<MessageWebComponentEvents>({
      click: props.onClick,
      mouseenter: props.onMouseEnter,
      mouseleave: props.onMouseLeave,
      loading: props.onLoading,
      render: props.onRender,
      editstart: props.onEditStart,
      editend: props.onEditEnd,
    });
  const combinedSetRef = useComposedRefs<Element | null>(
    props.forwardRef,
    setRef,
  );

  return (
    <cord-message
      id={props.id}
      class={props.className}
      style={props.style}
      ref={combinedSetRef}
      buffer-events={!listenersAttached}
      {...propsToAttributes(props)}
    ></cord-message>
  );
}
