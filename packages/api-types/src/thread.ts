import type {
  // These awkward imports and renames are for the benefit of generate.mjs which
  // doesn't spit out anything which wasn't actually defined in this file --
  // this lets us "define" these types with their proper names in this file (via
  // importing them to these weird names and then re-defining them with their
  // actual names).
  ThreadVariables as ThreadVariables_,
  ThreadParticipant as ThreadParticipant_,
  EntityMetadata,
  Location,
} from '@cord-sdk/types';

export type ThreadVariables = ThreadVariables_;
export type ThreadParticipant = ThreadParticipant_;

/**
 * https://docs.cord.com/reference/rest-api/threads/
 */
export type UpdateThreadVariables = Partial<
  Omit<ThreadVariables, 'total' | 'participants'> & {
    /**
     * Certain changes to the thread may post a message into the thread -- in
     * particular, resolving or unresolving a thread posts a message into the
     * thread saying "User un/resolved this thread". This parameter is the ID of
     * the User who will be listed as the author of that message. It's optional
     * -- if no user is specified, then those messages won't get posted.
     */
    userID: string;
    /** Triggers the typing indicator, or adds an additional user to the existing
     * typing indicator in the thread and lasts for 3 seconds.
     * Pass an empty array to clear all users typing. Automatically triggers
     * when a user is writing something in a Cord component.
     */
    typing: (string | number)[];
  }
>;

export interface CreateThreadVariables {
  /**
   * The [location](https://docs.cord.com/reference/location) of the thread.
   */
  location: Location;
  /**
   * A URL where the thread can be seen.  This determines where a user is sent
   * when they click on a reference to this thread, such as in a notification,
   * or if they click on a reference to a message in the thread and the message
   * doesn't have its own URL.
   */
  url: string;
  /**
   * The name of the thread.  This is shown to users when the thread is
   * referenced, such as in notifications.  You should use something like the
   * page title here.
   */
  name: string;
  /**
   * The organization that the thread belongs to.
   */
  organizationID: string;
  /**
   * Arbitrary key-value pairs that can be used to store additional information.
   */
  metadata?: EntityMetadata;
}
