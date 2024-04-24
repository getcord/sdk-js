import type { ClientUserData } from '@cord-sdk/types';
import { createContext, useContext } from 'react';
import { sameIDs, useUserData } from '../../hooks/user.js';
import { useMemoObject } from '../../hooks/useMemoObject.js';

export type UserDataContextType = {
  users: Record<string, ClientUserData | null>;
};

export const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function useComponentUserData(
  userID: string,
): ClientUserData | null | undefined;
export function useComponentUserData(
  userIDs: string[],
): Record<string, ClientUserData | null>;

export function useComponentUserData(
  userIDorIDs: string | string[],
): Record<string, ClientUserData | null> | ClientUserData | null | undefined {
  const context = useContext(UserDataContext);
  const memoizedUserIDorIDs = useMemoObject(userIDorIDs, sameIDs);

  // This very tortured call is to make the typechecker happy.  userIDorIDs
  // isn't a valid input for either overload of useUserData, but either of its
  // narrower types is.  The rules of hooks are also followed, because we're
  // calling the same hook on both branches.
  const fromApi = Array.isArray(memoizedUserIDorIDs)
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useUserData(memoizedUserIDorIDs, { skip: !!context })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useUserData(memoizedUserIDorIDs, { skip: !!context });

  return useMemoObject(
    context ? getFromContext(context, memoizedUserIDorIDs) : fromApi,
  );
}

function getFromContext(
  context: UserDataContextType,
  userIDorIDs: string | string[],
): Record<string, ClientUserData | null> | ClientUserData | null {
  if (Array.isArray(userIDorIDs)) {
    const result: Record<string, ClientUserData | null> = {};
    for (const userID of userIDorIDs) {
      result[userID] = context.users[userID] ?? null;
    }
    return result;
  } else {
    return context.users[userIDorIDs] ?? null;
  }
}
