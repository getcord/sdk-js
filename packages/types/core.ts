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
// These objects are structurally the same, but if we use a type alias then
// TypeScript will unify them in the type checker, so separate them.
export type EntityMetadata = { [key: string]: string | number | boolean };
export type Location = { [key: string]: string | number | boolean };

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
export interface PaginationParams {
  /**
   * When this is `true`, Cord is in the process of fetching additional data
   * from its backend. Once the fetch is complete, the additional items will be
   * appended to the result list, and `loading` will become `false`.
   *
   * Both the initial data load and a call to `fetchMore` will start a fetch and
   * cause `loading` to become `true`.
   */
  loading: boolean;

  /**
   * Call this function to fetch additional data from Cord's backend. It takes a
   * single argument, the number of additional items to fetch.
   *
   * Once called, `loading` will become `true` while the data is fetched. Once
   * the fetch is complete, the additional items will be appended to the result
   * list, and `loading` will return to `false`.
   *
   * This function returns a promise that is resolved once the fetch is complete.
   */
  fetchMore: FetchMoreCallback;

  /**
   * If this is `true`, then the list of results is incomplete, and you need to
   * call `fetchMore` to continue paginating through them. Once this becomes
   * `false`, all results are available, and calls to `fetchMore` won't do
   * anything.
   */
  hasMore: boolean;
}
