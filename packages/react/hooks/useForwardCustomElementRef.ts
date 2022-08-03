import type { HTMLCordElement } from '@cord-sdk/types';
import { useCallback } from 'react';

/*
  This hook observes the Cord custom elements lifecycle in the DOM and
  updates a forwarded ref as necessary.
*/
export function useForwardCustomElementRef<T extends HTMLCordElement>(
  forwardedRef: React.ForwardedRef<T>,
) {
  return useCallback(
    (element: T | null) => {
      if (!forwardedRef) {
        return;
      }

      const updateForwardedRef = (element: T | null) => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(element);
        } else {
          forwardedRef.current = element;
        }
      };

      if (!element) {
        // the element is not in the DOM at all
        updateForwardedRef(null);
        return;
      }

      if (element.initialised) {
        // the element is in the DOM and its associated custom element class is initialised
        updateForwardedRef(element);
        return;
      }

      // the element is in the DOM but the custom element class has not yet initialised,
      // so it's just an empy shell. set up a listener for an event which will be fired in
      // the CordComponent constructor. only once that event has been received is the
      // element instance correctly backed by the associated class instance that implements
      // the specific HTMLCordElement interface.

      let current = true;

      const onInitialised = () => {
        if (current) {
          updateForwardedRef(element);
        }
      };

      const eventName = `${element.nodeName.toLowerCase()}:initialised`;
      element.addEventListener(eventName, onInitialised);

      return () => {
        current = false;
        element.removeEventListener(eventName, onInitialised);
      };
    },

    [forwardedRef],
  );
}
