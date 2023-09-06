import { useRef } from 'react';

// For silly reasons, the main Cord repo has esModuleInterop off, which forces
// the import x = require() syntax here. But rollup doesn't like that in an esm
// build and requires the syntax below. The actual esbuild we do in the internal
// repo is fine with either, so let's use the one that actually works for the
// OSS rollup build and just tell TS to be quiet for our internal purposes in
// this one case. (Instead of disentangling this properly which is a huge pain
// and we've already wasted enough time on this build system crap.)
// @ts-ignore
import libIsEqual from 'fast-deep-equal/es6';

/**
 * Returns a memoized version of the given complex JS object (such as an array
 * or object).  You can use this to ensure customers passing object or array
 * literals to hooks don't cause unnecessary rerenders.
 */
export function useMemoObject<T>(
  obj: T,
  isEqual: (a: T, b: T) => boolean = libIsEqual,
) {
  const ref = useRef(obj);
  if (ref.current !== obj && !isEqual(ref.current, obj)) {
    ref.current = obj;
  }
  return ref.current;
}
