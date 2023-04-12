import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(componentAttributes.Avatar);

export type AvatarReactComponentProps = {
  userId: string;
};

export function Avatar(
  props: ReactPropsWithStandardHTMLAttributes<AvatarReactComponentProps>,
) {
  return (
    <cord-avatar
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-avatar>
  );
}
