import type { UserData, ViewerUserData } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';

function sameIDs(left: string | string[], right: string | string[]): boolean {
  if (Array.isArray(left)) {
    if (!Array.isArray(right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    return left.every((value, index) => value === right[index]);
  }
  if (Array.isArray(right)) {
    return false;
  }
  return left === right;
}

/**
 * This method allows you to observe data about a user, including live updates.
 * @example Overview
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = user.useUserData(userID);
 * ```
 * @example Usage
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = user.useUserData('user-123');
 * return (
 *   <div>
 *     {!data && "Loading..."}
 *     {data && (
 *       <p>User name: {data.name}</p>
 *       <p>User short name: {data.shortName}</p>
 *       <p>User profile picture: <img src={data.profilePictureURL} /></p>
 *     )}
 *   </div>
 * );
 * ```
 * @param userID - The user to fetch data for.
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useUserData(userID: string): UserData | null | undefined;

/**
 * This method allows you to observe data about multiple users, including live
 * updates.
 * @example Overview
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = user.useUserData(userIDs);
 * ```
 * @example Usage
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = user.useUserData(['user-123', 'user-456']);
 * return (
 *   <div>
 *     {!data && "Loading..."}
 *     {data && (
 *       {Object.entries(data).map(([id, userData]) => (
 *         <div key={id}>
 *           <p>User ID: {id}</p>
 *           <p>User name: {userData.name}</p>
 *           <p>User profile picture: <img src={userData.profilePictureURL} /></p>
 *         </div>
 *       ))}
 *     )}
 *   </div>
 * );
 * ```
 * @param userIDs - The list of user IDs to fetch data for.
 * @returns The hook will initially return an empty object while the data loads
 * from our API. Once some data has loaded, your component will re-render and
 * the hook will return an object with a property for each requested user ID. If
 * the property is missing, the data for that user has not yet been loaded; if
 * there's no user with that ID, it will be `null`; and otherwise it will be an
 * object which will contain the fields described under "Available Data" above.
 * The component will automatically re-render if any of the data changes or as
 * more data is loaded, i.e., this data is always "live".
 */
export function useUserData(userIDs: string[]): Record<string, UserData | null>;
export function useUserData(
  userIDorIDs: string | string[],
): Record<string, UserData | null> | UserData | null | undefined {
  const { sdk } = useCordContext('user.useUserData');
  const userSDK = sdk?.user;

  const [data, setData] = useState<
    Record<string, UserData | null> | UserData | null | undefined
  >(Array.isArray(userIDorIDs) ? {} : undefined);

  const [memoizedUserIDorIDs, setMemoizedUserIDorIDs] = useState<
    string | string[]
  >();

  useEffect(() => {
    setMemoizedUserIDorIDs((previous) => {
      if (!previous || !sameIDs(previous, userIDorIDs)) {
        return userIDorIDs;
      }
      return previous;
    });
  }, [userIDorIDs]);

  useEffect(() => {
    if (!userSDK || !memoizedUserIDorIDs) {
      return;
    }
    // This very tortured call is to make the typechecker happy.  userIDorIDs
    // isn't a valid input for either overload of observeUserData, but either of
    // its narrower types is.
    const ref = Array.isArray(memoizedUserIDorIDs)
      ? userSDK.observeUserData(memoizedUserIDorIDs, setData)
      : userSDK.observeUserData(memoizedUserIDorIDs, setData);

    return () => {
      userSDK.unobserveUserData(ref);
    };
  }, [userSDK, memoizedUserIDorIDs]);

  return data;
}

/**
 * This method allows you to observe data about the logged-in user, including
 * live updates.
 * @example Overview
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = thread.useViewerData();
 * ```
 * @example Usage
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const data = thread.useViewerData();
 * return (
 *   <div>
 *     {!data && "Loading..."}
 *     {data && (
 *       <p>User name: {data.name}</p>
 *       <p>User short name: {data.shortName}</p>
 *       <p>User profile picture: <img src={data.profilePictureURL} /></p>
 *       <p>Organization ID: {data.organizationID}</p>
 *     )}
 *   </div>
 * );
 * ```
 * @returns The hook will initially return `undefined` while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above. The component will automatically re-render if any of the data changes,
 * i.e., this data is always "live".
 */
export function useViewerData(): ViewerUserData | undefined {
  const { sdk } = useCordContext('user.useViewerData');
  const userSDK = sdk?.user;

  const [data, setData] = useState<ViewerUserData>();

  useEffect(() => {
    if (!userSDK) {
      return;
    }
    const ref = userSDK.observeViewerData(setData);

    return () => {
      userSDK.unobserveViewerData(ref);
    };
  }, [userSDK]);

  return data;
}
