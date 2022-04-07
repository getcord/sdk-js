import jwt from 'jsonwebtoken';

export type PlatformUserVariables = {
  email: string;
  name?: string;
  profile_picture_url?: string;
  status?: 'active' | 'deleted';
  first_name?: string;
  last_name?: string;
};

export type PlatformOrganizationVariables = {
  name: string;
  status?: 'active' | 'deleted';
  members?: Array<string>;
};

export type ClientAuthTokenData = {
  app_id: string;
  user_id: string;
  organization_id: string;
  user_details?: PlatformUserVariables;
  organization_details?: PlatformOrganizationVariables;
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
