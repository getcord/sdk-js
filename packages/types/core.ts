export type UUID = string;
export type UserID = string;
export type OrganizationID = string;
export type ThreadID = string;
export type MessageID = string;

/*
 * `FlatJsonObject` is an object where all values are simple, scalar types
 * (string, number or boolean).
 */
export type FlatJsonObject = { [key: string]: string | number | boolean };
export type EntityMetadata = FlatJsonObject;
export type Location = FlatJsonObject;

// For backwards compatibility, will be removed along with the deprecated context prop
export type Context = Location;

// Fast comparison of two Locations
export function isEqualLocation(
  a: Location | undefined,
  b: Location | undefined,
) {
  // If `a` and `b` are the same object (or both are undefined) -> true
  if (a === b) {
    return true;
  }
  // If either `a` or `b` is undefined -> false
  // (If they are both undefined, we returned true above.)
  if (!a || !b) {
    return false;
  }

  // Get all keys of `a` and check that `b` has the same number of keys.
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }

  // If `b` does not have all the keys of `a` -> false
  if (!aKeys.every((aKey) => Object.prototype.hasOwnProperty.call(b, aKey))) {
    return false;
  }

  // We know that `a` and `b` have identical keys. Return whether the values are
  // identical, too.
  return aKeys.every((key) => a[key] === b[key]);
}

export type ListenerRef = number;

export type FetchMoreCallback = (howMany: number) => Promise<void>;
export type PaginationParams = {
  loading: boolean;
  fetchMore: FetchMoreCallback;
  hasMore: boolean;
};
