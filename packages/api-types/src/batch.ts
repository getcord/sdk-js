import type { ID } from './coreTypes';
import type { UpdatePlatformOrganizationVariables } from './org';
import type { UpdatePlatformUserVariables } from './user';

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
