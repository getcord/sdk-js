import * as jwt from 'jsonwebtoken';
import type { ClientAuthTokenData } from '@cord-sdk/api-types';

export type { ClientAuthTokenData };

export function getClientAuthToken(
  project_id: string,
  project_secret: string,
  payload: Omit<ClientAuthTokenData, 'app_id' | 'project_id'>,
): string {
  if (!payload || !payload.user_id) {
    // You can't get here in TS -- it's a TS type error -- but not everyone uses
    // TS.
    throw new Error(
      'Missing user_id. ' +
        'A token without a user_id can be misinterpreted as an administrative server auth token ' +
        '(which should never be given to clients). ' +
        'If you intended to generate a server auth token, call getServerAuthToken instead.',
    );
  }

  return jwt.sign({ ...payload, project_id }, project_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}

export function getServerAuthToken(
  project_id: string,
  project_secret: string,
): string {
  return jwt.sign({ app_id: project_id }, project_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}

export function getApplicationManagementAuthToken(
  customer_id: string,
  customer_secret: string,
): string {
  return jwt.sign({ customer_id }, customer_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}

export function getProjectManagementAuthToken(
  customer_id: string,
  customer_secret: string,
): string {
  return jwt.sign({ customer_id }, customer_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}
