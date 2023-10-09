import type { ID } from './core';

export interface ServerOrganizationData {
  /**
   * ID of the organization
   */
  id: ID;

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

export type ServerUpdateOrganization = Partial<
  Omit<ServerOrganizationData, 'id' | 'members'> & {
    /**
     * List of partner-specific IDs of the users who are members of this organization.
     * This will replace the existing members.
     */
    members?: ID[];
  }
>;
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
export interface ServerCreateOrganization extends ServerOrganizationData {}

export interface ServerGetOrganization extends ServerOrganizationData {}

export interface ServerListOrganization
  extends Omit<ServerOrganizationData, 'members'> {}
