import { useEffect, useRef } from 'react';

export const useUpdatingRef = <V>(value: V) => {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
};
