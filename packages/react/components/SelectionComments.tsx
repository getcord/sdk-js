import React from 'react';

import type { PropsWithStandardHTMLAttributes } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithLocation } from '../types';

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
  props: PropsWithStandardHTMLAttributes<SelectionCommentsReactComponentProps>,
) {
  return (
    <cord-selection-comments
      id={props.id}
      class={props.className}
      {...propsToAttributes({ location, ...props })}
    >
      {props.children}
    </cord-selection-comments>
  );
}
