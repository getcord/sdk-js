import type { ID } from './core';

export interface ServerOrganizationData {
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

export type ServerUpdateOrganization = Partial<ServerOrganizationData>;
export interface ServerUpdateOrganizationMembers {
  add?: (string | number)[];
  remove?: (string | number)[];
}

/**
 * @deprecated type for deprecated api route
 */
export type ServerCreateOrganization = ServerOrganizationData & { id: ID };
