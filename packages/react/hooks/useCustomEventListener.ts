import { useState, useEffect } from 'react';

export function useCustomEventListeners<T extends Record<string, unknown[]>>(
  events: {
    [P in keyof T]: ((...args: T[P]) => unknown) | undefined;
  },
) {
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) {
      return;
    }

    const handlers = Object.entries(events).map(([event, callback]) => {
      const customEventHandler = (e: Event) => {
        if (e instanceof CustomEvent) {
          callback?.apply(null, e.detail as unknown[]);
        }
      };

      element.addEventListener(event, customEventHandler);

      return [event, customEventHandler] as const;
    });

    return () => {
      for (const [event, handler] of handlers) {
        element.removeEventListener(event, handler);
      }
    };
  }, [element, events]);

  return setElement;
}
