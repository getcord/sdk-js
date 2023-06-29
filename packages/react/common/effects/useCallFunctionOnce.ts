import { useCallback, useRef } from 'react';

export function useCallFunctionOnce(fn?: () => unknown) {
  const calledAlready = useRef<boolean>(false);

  return useCallback(() => {
    if (!calledAlready.current) {
      fn?.();
      calledAlready.current = true;
    }
  }, [fn]);
}
