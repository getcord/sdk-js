import type { ID } from './coreTypes';
export interface PlatformUserVariables {
  /**
   * @format email
   */
  email: string;
  name?: string;
  short_name?: string;
  status?: 'active' | 'deleted';
  /**
   * @format uri
   */
  profile_picture_url?: string;
  /**
   * @deprecated
   */
  first_name?: string;
  /**
   * @deprecated
   */
  last_name?: string;
}

export interface PlatformOrganizationVariables {
  name: string;
  status?: 'active' | 'deleted';
  members?: Array<string | number>;
}
/**
 * https://docs.cord.com/reference/rest-api/users/
 */
export type UpdatePlatformUserVariables = Partial<PlatformUserVariables>;
/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export type UpdatePlatformOrganizationVariables =
  Partial<PlatformOrganizationVariables>;
/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export interface UpdatePlatformOrganizationMembersVariables {
  add?: Array<string | number>;
  remove?: Array<string | number>;
}
/**
 * https://docs.cord.com/reference/rest-api/batch/
 */
export interface BatchAPIVariables {
  /**
   * @maxItems 10000
   */
  users?: Array<(PlatformUserVariables | UpdatePlatformUserVariables) & ID>;
  /**
   * @maxItems 1000
   */
  organizations?: Array<
    (PlatformOrganizationVariables | UpdatePlatformOrganizationVariables) & ID
  >;
}

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformUserVariables = PlatformUserVariables & ID;

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformOrganizationVariables =
  PlatformOrganizationVariables & ID;
