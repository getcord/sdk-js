import type { EntityMetadata, Location } from '@cord-sdk/types';

/**
 * @minLength 1
 * @maxLength 128
 * */
export type ID = string | number;
export type TimestampRange = {
  /**
   * Timestamp from where to start the interval. If not present, the interval will have no start date and any data will include everything up to the provided `to` timestamp.
   */
  from?: Date;
  /**
   * Timestamp where to end the interval. If not present, the interval will have no end date and any data will include everything from the provided `from` timestamp.
   */
  to?: Date;
};

export type FilterParameters = {
  /**
   * The location for the thread.
   */
  location?: Location;
  /**
   * Arbitrary key-value pairs of data associated with the object.
   */
  metadata?: EntityMetadata;
  /**
   * Timestamp when the first message in a thread was created.
   */
  firstMessageTimestamp?: TimestampRange;
  /**
   * Timestamp when a message in a thread was last created or updated.
   */
  mostRecentMessageTimestamp?: TimestampRange;
};
