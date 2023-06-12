import type { ID } from './coreTypes';

export interface PlatformOrganizationVariables {
  /**
   * Organization name
   */
  name: string;

  status?: 'active' | 'deleted';

  /**
   * List of partner-specific IDs of the users who are members of this organization
   */
  members?: (string | number)[];
}

/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export type UpdatePlatformOrganizationVariables =
  Partial<PlatformOrganizationVariables>;

/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export interface UpdatePlatformOrganizationMembersVariables {
  add?: (string | number)[];
  remove?: (string | number)[];
}

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformOrganizationVariables =
  PlatformOrganizationVariables & { id: ID };
