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

export function useUserData(userID: string): UserData | null | undefined;
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
