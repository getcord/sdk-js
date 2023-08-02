import type { ID } from './core';
import type { ServerUpdateOrganization } from './organization';
import type { ServerUpdateUser } from './user';

/**
 * https://docs.cord.com/rest-apis/batch/
 */
export interface ServerUpdateBatch {
  /**
   * List of user objects. Every object must include the id field. If the user
   * already exists, all other fields are optional and only updated when
   * present. If the user does not already exist, fields are required as
   * described in the [Create or update a
   * user](https://docs.cord.com/rest-apis/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 10000
   */
  users?: (ServerUpdateUser & { id: ID })[];
  /**
   * List of organization objects. Every object must include the id field. If
   * the organization already exists, all other fields are optional and only
   * updated when present. If the organization does not already exist, fields
   * are required as described in the [Create or update an
   * organization](https://docs.cord.com/rest-apis/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 1000
   */
  organizations?: (ServerUpdateOrganization & { id: ID })[];
}
