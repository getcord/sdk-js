import React from 'react';

import type { PropsWithStandardHTMLAttributes } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Settings,
);

export type SettingsReactComponentProps = Record<string, never>;

export function Settings(
  props: PropsWithStandardHTMLAttributes<SettingsReactComponentProps>,
) {
  return (
    <cord-settings
      id={props.id}
      class={props.className}
      {...propsToAttributes(props)}
    />
  );
}
