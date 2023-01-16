import React from 'react';

import type { CollaborationWebComponentEvents } from '@cord-sdk/types';
import {
  componentAttributes,
  propsToAttributeConverter,
} from '@cord-sdk/components';

import { useCustomEventListeners } from '../hooks/useCustomEventListener';
import { useCordLocation } from '../hooks/useCordLocation';
import type {
  ReactPropsWithLocation,
  ReactPropsWithStandardHTMLAttributes,
} from '../types';

const propsToAttributes = propsToAttributeConverter(
  componentAttributes.Collaboration,
);

export type CollaborationReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  showPresence?: boolean;
  showInbox?: boolean;
  excludeViewerFromPresence?: boolean;
  showAllActivity?: boolean;
  showPinsOnPage?: boolean;
}>;

export function Collaboration(
  props: ReactPropsWithStandardHTMLAttributes<CollaborationReactComponentProps>,
) {
  const setRef = useCustomEventListeners<CollaborationWebComponentEvents>({});

  const location = useCordLocation();

  return (
    <cord-collaboration
      id={props.id}
      class={props.className}
      style={props.style}
      ref={setRef}
      {...propsToAttributes({ location, ...props })}
    />
  );
}
