import type { ID } from './core';
import type { ServerUpdateGroup } from './group';
import type { ServerUpdateOrganization } from './organization';
import type { ServerUpdateUser } from './user';

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
   * @deprecated - use group_id instead
   */
  organization_id?: ID;
  /**
   * The ID for the user’s group
   */
  group_id?: ID;
  /**
   * If present, update’s the user’s details, or creates a user with those
   * details if the user_id is new to Cord. This is an object that contains the
   * same fields as the [user management REST
   * endpoint](https://docs.cord.com/rest-apis/users/)
   */
  user_details?: ServerUpdateUser;
  /**
   * @deprecated - use group_details instead
   */
  organization_details?: ServerUpdateOrganization;
  /**
   * If present, updates the group's details, or creates a group
   * with those details if the group_id is new to Cord. This is an object
   * that contains the same fields as the [group management REST
   * endpoint](https://docs.cord.com/rest-apis/groups/)
   */
  group_details?: ServerUpdateGroup;
}
