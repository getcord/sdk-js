import type {
  ServerCreateUser,
  ServerListUserParameters,
  ServerUpdateUser,
  ServerListUser,
} from '@cord-sdk/types';

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface UpdatePlatformUserVariables extends ServerUpdateUser {}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface CreatePlatformUserVariables extends ServerCreateUser {}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface ListPlatformUserVariables extends ServerListUser {}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface ListUserQueryParameters extends ServerListUserParameters {}
