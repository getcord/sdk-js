import type { EntityMetadata, Location } from '@cord-sdk/types';

/**
 * @minLength 1
 * @maxLength 128
 * */
export type ID = string | number;

export type FilterParameters = {
  /**
   * The location for the thread.
   */
  location?: Location;
  /**
   * Arbitrary key-value pairs of data associated with the object.
   */
  metadata?: EntityMetadata;
};
