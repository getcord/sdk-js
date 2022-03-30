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

      const eventName = `${element.nodeName.toLowerCase()}:${event}`;
      element.addEventListener(eventName, customEventHandler);

      return [eventName, customEventHandler] as const;
    });

    return () => {
      for (const [eventName, handler] of handlers) {
        element.removeEventListener(eventName, handler);
      }
    };
  }, [element, events]);

  return setElement;
}
