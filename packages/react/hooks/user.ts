import type {
  ClientUserData,
  FetchMoreCallback,
  GroupMembersData,
  ObserveGroupMembersOptions,
  ObserveOrgMembersOptions,
  OrgMembersData,
  SearchUsersOptions,
  SearchUsersResult,
  ViewerUserData,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext.tsx';
import { useMemoObject } from './useMemoObject.ts';

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
export function useUserData(userID: string): ClientUserData | null | undefined;

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
export function useUserData(
  userIDs: string[],
): Record<string, ClientUserData | null>;
export function useUserData(
  userIDorIDs: string | string[],
): Record<string, ClientUserData | null> | ClientUserData | null | undefined {
  const { sdk } = useCordContext('user.useUserData');
  const userSDK = sdk?.user;

  const [data, setData] = useState<
    Record<string, ClientUserData | null> | ClientUserData | null | undefined
  >(Array.isArray(userIDorIDs) ? {} : undefined);

  const memoizedUserIDorIDs = useMemoObject(userIDorIDs, sameIDs);

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
 * const data = user.useViewerData();
 * return (
 *   <div>
 *     {!data && "Loading..."}
 *     {data && (
 *       <p>User name: {data.name}</p>
 *       <p>User short name: {data.shortName}</p>
 *       <p>User profile picture: <img src={data.profilePictureURL} /></p>
 *       <p>Group ID: {data.groupID}</p>
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

/**
 * This method allows you to observe the members of a group the current user is
 * a member of - either the current group the viewer is logged into, or, if
 * specified as an option, another group the viewer is a member of.
 * @example Overview
 * ```javascript
 * import { user } from '@cord-sdk/react';
 * const { groupMembers, loading, hasMore, fetchMore } = user.useGroupMembers();
 * return (
 *   <div>
 *     {groupMembers.map((groupMembers) => (
 *       <div key={groupMembers.id}>
 *         Group member ${groupMembers.id} is called ${groupMembers.name}!
 *       </div>
 *     ))}
 *     {loading ? (
 *       <div>Loading...</div>
 *     ) : hasMore ? (
 *       <div onClick={() => fetchMore(10)}>Fetch 10 more</div>
 *     ) : null}
 *   </div>
 * );
 * ```
 * @returns The hook will initially return an empty array while the data loads from
 * our API. Once it has loaded, your component will re-render and the hook will
 * return an object containing the fields described under "Available Data"
 * above.
 */
export function useGroupMembers(
  options: ObserveGroupMembersOptions = {},
): GroupMembersData {
  const { sdk } = useCordContext('user.useGroupMemberData');
  const userSDK = sdk?.user;

  const [groupMembers, setGroupMembers] = useState<ClientUserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<FetchMoreCallback>(
    () => async (_n: number) => {},
  );

  const optionsMemo = useMemoObject(options);

  useEffect(() => {
    if (!userSDK) {
      return;
    }
    const ref = userSDK.observeGroupMembers(
      // eslint-disable-next-line @typescript-eslint/no-shadow -- using to set shadowed vars.
      ({ groupMembers, loading, hasMore, fetchMore }) => {
        setGroupMembers(groupMembers);
        setLoading(loading);
        setHasMore(hasMore);
        setFetchMore((_previous: unknown) => fetchMore);
      },
      optionsMemo,
    );

    return () => {
      userSDK.unobserveGroupMembers(ref);
    };
  }, [userSDK, optionsMemo]);

  return { groupMembers, loading, hasMore, fetchMore };
}

/**
 * This method allows searching for users with various options.
 * Using the `searchQuery` will filter users by what their name start with.
 * If no options are passed, a list of users will be returned.
 * @example Overview
 *
 * ```javascript
 * // Will return a list of users starting with 'al';
 * import { user } from '@cord-sdk/react';
 *
 * const searchResults = useSearchUsers({ searchQuery: 'al' });
 *
 * return (
 *   <div>
 *      {!searchResults && "Loading..."}
 *      {searchResults &&
 *        searchResults.users.map((user) => (
 *          <div key={user.id}>
 *            <p>User name: {user.name}</p>
 *           </div>
 *        ))}
 *   </div>
 * );
 * ```
 * @returns A promise that resolves to into an object with `users` which
 * is a list of users in the group. This is a one time return.
 */
export function useSearchUsers(
  options: SearchUsersOptions = {},
): SearchUsersResult | undefined {
  const { sdk } = useCordContext('user.searchUsers');
  const userSDK = sdk?.user;

  const [data, setData] = useState<SearchUsersResult | undefined>(undefined);
  const { searchQuery, groupID } = options;

  const inputsMemo = useMemoObject({
    searchQuery,
    groupID: groupID ?? sdk?.groupID,
  });

  useEffect(() => {
    if (!userSDK) {
      return;
    }
    userSDK
      .searchUsers(inputsMemo)
      .then((result) => setData(result))
      .catch((error) => console.log(error));
  }, [inputsMemo, userSDK]);

  return data;
}

/*
 * @deprecated see useGroupMembers
 */
export function useOrgMembers(
  options: ObserveOrgMembersOptions = {},
): OrgMembersData {
  const optionsWithGroup = { groupID: options.organizationID };

  const { groupMembers, loading, fetchMore, hasMore } =
    useGroupMembers(optionsWithGroup);

  return { orgMembers: groupMembers, loading, fetchMore, hasMore };
}
