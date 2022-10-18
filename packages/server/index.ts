import jwt from 'jsonwebtoken';
import type { Types } from '@cord-sdk/api-types';

export type ClientAuthTokenData = {
  app_id: string;
  user_id: string;
  organization_id: string;
  user_details?: Types['PlatformUserVariables'];
  organization_details?: Types['PlatformOrganizationVariables'];
};

export function getClientAuthToken(
  app_id: string,
  app_secret: string,
  payload: Omit<ClientAuthTokenData, 'app_id'>,
): string {
  return jwt.sign({ ...payload, app_id }, app_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}

export function getServerAuthToken(app_id: string, app_secret: string): string {
  return jwt.sign({ app_id }, app_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}
