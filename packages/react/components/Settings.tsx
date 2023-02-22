import React from 'react';

import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';
import type { ReactPropsWithStandardHTMLAttributes } from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Settings,
);

export type SettingsReactComponentProps = Record<string, unknown>;

export function Settings(
  props: ReactPropsWithStandardHTMLAttributes<SettingsReactComponentProps>,
) {
  return (
    <cord-settings
      id={props.id}
      class={props.className}
      style={props.style}
      {...propsToAttributes(props)}
    />
  );
}
