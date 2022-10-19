import type { ID } from './coreTypes';
export interface PlatformUserVariables {
  /**
   * Email address
   *
   * @format email
   */
  email: string;

  /**
   * Full user name
   */
  name?: string;

  /**
   * Short user name. In most cases, this will be preferred over name when set.
   */
  short_name?: string;

  status?: 'active' | 'deleted';

  /**
   * @format uri
   */
  profile_picture_url?: string;

  /**
   * User's first name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  first_name?: string;

  /**
   * User's last name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  last_name?: string;
}

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
  add?: (string | number)[];
  remove?: (string | number)[];
}

/**
 * https://docs.cord.com/reference/rest-api/batch/
 */
export interface BatchAPIVariables {
  /**
   * List of user objects. Every object must include the id field. If the user
   * already exists, all other fields are optional and only updated when
   * present. If the user does not already exist, fields are required as
   * described in the [Create or update a
   * user](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 10000
   */
  users?: (UpdatePlatformUserVariables & ID)[];
  /**
   * List of organization objects. Every object must include the id field. If
   * the organization already exists, all other fields are optional and only
   * updated when present. If the organization does not already exist, fields
   * are required as described in the [Create or update an
   * organization](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 1000
   */
  organizations?: (UpdatePlatformOrganizationVariables & ID)[];
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
