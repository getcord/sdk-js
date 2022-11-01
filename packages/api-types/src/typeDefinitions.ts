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
  users?: (UpdatePlatformUserVariables & { id: ID })[];
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
  organizations?: (UpdatePlatformOrganizationVariables & { id: ID })[];
}
/**
 * https://docs.cord.com/in-depth/authentication/
 * @additionalProperties true
 */
export interface ClientAuthTokenData {
  /**
   * Your app ID
   * @format uuid
   */
  app_id: string;
  /**
   * The ID for the user
   */
  user_id: ID;
  /**
   * The ID for the user’s organization
   */
  organization_id: ID;
  /**
   * If present, update’s the user’s details, or creates a user with those
   * details if the user_id is new to Cord. This is an object that contains the
   * same fields as the [user management REST
   * endpoint](https://docs.cord.com/reference/rest-api/users/)
   */
  user_details?: PlatformUserVariables;
  /**
   * If present, update’s the organization’s details, or creates an organization
   * with those details if the organization_id is new to Cord. This is an object
   * that contains the same fields as the [organization management REST
   * endpoint](https://docs.cord.com/reference/rest-api/organizations/)
   */
  organization_details?: PlatformOrganizationVariables;
}

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformUserVariables = PlatformUserVariables & { id: ID };

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformOrganizationVariables =
  PlatformOrganizationVariables & { id: ID };