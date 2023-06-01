import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.AddReaction,
);

export type AddReactionReactComponentProps = {
  threadId?: string;
  messageId?: string;
  enableTooltip?: boolean;
  disabled?: boolean;
};

export function AddReaction(
  props: ReactPropsWithStandardHTMLAttributes<AddReactionReactComponentProps>,
) {
  return (
    <cord-add-reaction
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-add-reaction>
  );
}
