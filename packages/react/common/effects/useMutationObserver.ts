import { useEffect, useRef } from 'react';
import { useUpdatingRef } from './useUpdatingRef.js';

export function useMutationObserver(
  targetElement: HTMLElement | null,
  callback: MutationCallback,
  options?: MutationObserverInit,
) {
  const callbackRef = useUpdatingRef(callback);

  const observerRef = useRef(
    new MutationObserver(
      (mutation: MutationRecord[], observer: MutationObserver) =>
        callbackRef.current(mutation, observer),
    ),
  );
  const optionsRef = useRef({ ...options });

  useEffect(() => {
    const observer = observerRef.current;
    if (targetElement) {
      observer.observe(targetElement, optionsRef.current);
    }

    return () => observer.disconnect();
  }, [targetElement]);
}
