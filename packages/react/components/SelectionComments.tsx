import React from 'react';

import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.SelectionComments,
);

export type SelectionCommentsReactComponentProps = React.PropsWithChildren<
  ReactPropsWithLocation<{
    buttonLabel?: string;
    iconUrl?: string;
    threadName?: string;
  }>
>;

export function SelectionComments(
  props: ReactPropsWithStandardHTMLAttributes<SelectionCommentsReactComponentProps>,
) {
  return (
    <cord-selection-comments
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-selection-comments>
  );
}
