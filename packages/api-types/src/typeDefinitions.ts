export * from './application';
export * from './batch';
export * from './message';
export * from './notifications';
export * from './org';
export * from './presence';
export * from './thread';
export * from './user';

import type { ID } from './coreTypes';
import type { PlatformUserVariables } from './user';
import type { PlatformOrganizationVariables } from './org';

/**
 * https://docs.cord.com/reference/authentication/
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
