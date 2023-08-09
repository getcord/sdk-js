import type { ID } from './core';

export interface ServerOrganizationData {
  /**
   * Organization name
   */
  name: string;

  /**
   * Whether this organization is active or deleted.  Attempting to log into a
   * deleted organization will fail.
   */
  status?: 'active' | 'deleted';

  /**
   * List of partner-specific IDs of the users who are members of this organization
   */
  members?: ID[];
}

export type ServerUpdateOrganization = Partial<ServerOrganizationData>;
export interface ServerUpdateOrganizationMembers {
  /**
   * The IDs of users to add to this organization.
   */
  add?: ID[];
  /**
   * The IDs of users to remove from this organization.
   */
  remove?: ID[];
}

/**
 * @deprecated type for deprecated api route
 */
export type ServerCreateOrganization = ServerOrganizationData & { id: ID };
