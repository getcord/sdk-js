import { useMemo } from 'react';

// This function determines if X has property Y and does so in a
// a way that preserves the type information within TypeScript.
export function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

type UnpackedClientAuthTokenPayload = {
  userID: string | undefined;
  organizationID: string | undefined;
};

function useUnpackClientAuthTokenPayload(
  clientAuthToken: string | null | undefined,
): UnpackedClientAuthTokenPayload {
  return useMemo(() => {
    const ret: UnpackedClientAuthTokenPayload = {
      userID: undefined,
      organizationID: undefined,
    };

    if (!clientAuthToken) {
      return ret;
    }

    const segments = clientAuthToken.split('.');
    if (segments.length !== 3) {
      return ret;
    }

    const [_header, payload] = segments;

    let decodedPayload: unknown;
    try {
      decodedPayload = JSON.parse(atob(payload));
    } catch (e) {
      console.error('`clientAuthToken` payload did not contain valid JSON');
      console.error(e);
      return ret;
    }

    if (typeof decodedPayload !== 'object' || decodedPayload === null) {
      console.error('invalid `clientAuthToken` payload: ' + payload);
      return ret;
    }

    if (
      hasOwnProperty(decodedPayload, 'organization_id') &&
      typeof decodedPayload.organization_id === 'string' &&
      hasOwnProperty(decodedPayload, 'user_id') &&
      typeof decodedPayload.user_id === 'string'
    ) {
      ret.userID = decodedPayload.user_id;
      ret.organizationID = decodedPayload.organization_id;
    } else {
      console.log('`clientAuthToken` was missing user_id or organization_id');
    }

    return ret;
  }, [clientAuthToken]);
}

export default useUnpackClientAuthTokenPayload;
