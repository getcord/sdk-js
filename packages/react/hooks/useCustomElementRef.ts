import type React from 'react';
import { useCallback } from 'react';
import type { HTMLCordElement } from '@cord-sdk/types';
import type { CustomEventsDefinition } from './useCustomEventListener';
import { useCustomEventListeners } from './useCustomEventListener';
import { useForwardCustomElementRef } from './useForwardCustomElementRef';

export function useCustomElementRef<
  Events extends Record<string, unknown[]>,
  HTMLElementInterface extends HTMLCordElement,
>(
  events: CustomEventsDefinition<Events>,
  forwardedRef: React.ForwardedRef<HTMLElementInterface>,
) {
  const updateCustomEventListeners = useCustomEventListeners(events);
  const updateForwardedRef = useForwardCustomElementRef(forwardedRef);

  return useCallback(
    (e: HTMLElementInterface | null) => {
      updateForwardedRef(e);
      updateCustomEventListeners(e);
    },
    [updateCustomEventListeners, updateForwardedRef],
  );
}
