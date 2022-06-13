import type React from 'react';
import type { Location } from '@cord-sdk/types';
export type ReactPropsWithLocation<T> = T & {
  /**
   * @deprecated The context prop has been renamed to location.
   */
  context?: Location;
  location?: Location;
};

export type PresenceReducerOptions = ReactPropsWithLocation<{
  excludeViewer?: boolean;
  onlyPresentUsers?: boolean;
  exactMatch?: boolean;
}>;

export type PropsWithRef<T> = T & {
  forwardRef?: React.MutableRefObject<Element | null>;
};
