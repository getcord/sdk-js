import type { ID } from './core';

export interface ServerGroupData {
  /**
   * ID of the group
   */
  id: ID;

  /**
   * Group name. Required when creating an group.
   */
  name: string;

  /**
   * Whether this group is active or deleted.  Attempting to log into a
   * deleted group will fail.
   */
  status?: 'active' | 'deleted';

  /**
   * List of partner-specific IDs of the users who are members of this group
   */
  members?: ID[];

  /**
   * If the group has connected to a Slack workspace
   */
  connectedToSlack: boolean;
}

export type ServerUpdateGroup = Partial<
  Omit<ServerGroupData, 'id' | 'members' | 'connectedToSlack'> & {
    /**
     * List of partner-specific IDs of the users who are members of this group.
     * This will replace the existing members.
     */
    members?: ID[];
  }
>;

export interface ServerUpdateGroupMembers {
  /**
   * The IDs of users to add to this group.
   */
  add?: ID[];
  /**
   * The IDs of users to remove from this group.
   */
  remove?: ID[];
}

export interface ServerGetGroup extends ServerGroupData {}

export interface ServerListGroup extends Omit<ServerGroupData, 'members'> {}
