import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { Orientation } from '@cord-sdk/types';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.ThreadFacepile,
);

export type ThreadFacepileReactComponentProps = {
  threadId: string;
  maxUsers?: number;
  showExtraUsersNumber?: boolean;
  orientation?: Orientation;
};

export function ThreadFacepile(
  props: ReactPropsWithStandardHTMLAttributes<ThreadFacepileReactComponentProps>,
) {
  return (
    <cord-thread-facepile
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    ></cord-thread-facepile>
  );
}
