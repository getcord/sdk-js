import type {
  // These awkward imports and renames are for the benefit of generate.mjs which
  // doesn't spit out anything which wasn't actually defined in this file --
  // this lets us "define" these types with their proper names in this file (via
  // importing them to these weird names and then re-defining them with their
  // actual names).
  RestApiThreadData,
  ThreadParticipant as ThreadParticipant_,
} from '@cord-sdk/types';
import type { FilterParameters } from './coreTypes';

export type ThreadVariables = RestApiThreadData;
export type ThreadParticipant = ThreadParticipant_;

/**
 * https://docs.cord.com/rest-apis/threads/
 */
export type UpdateThreadVariables = Partial<
  Omit<ThreadVariables, 'total' | 'participants' | 'typing' | 'resolved'> & {
    /**
     * Certain changes to the thread may post a message into the thread -- in
     * particular, resolving or unresolving a thread posts a message into the
     * thread saying "User un/resolved this thread". This parameter is the ID of
     * the User who will be listed as the author of that message. It's optional
     * -- if no user is specified, then those messages won't get posted.
     */
    userID: string;
    /**
     * Marks the specified users as typing in this thread.  The typing indicator
     * expires after 3 seconds, so to continually show the indicator it needs to
     * be called on an interval.  Pass an empty array to clear all users' typing indicators.
     */
    typing: string[];
    /**
     * Whether the thread is resolved.  Setting this to `true` is equivalent to
     * setting `resolvedTimestamp` to the current time, and setting this to
     * `false` is equivalent to setting `resolvedTimestamp` to `null`.
     */
    resolved?: boolean;
  }
>;

export interface CreateThreadVariables
  extends Pick<
      ThreadVariables,
      'id' | 'location' | 'url' | 'name' | 'organizationID'
    >,
    Partial<
      Omit<
        ThreadVariables,
        // Required fields
        | 'location'
        | 'url'
        | 'name'
        | 'organizationID'
        | 'id'
        // Non-create fields
        | 'total'
        | 'resolved'
        | 'resolvedTimestamp'
        | 'participants'
        | 'repliers'
        | 'typing'
      >
    > {
  /**
   * Whether the thread is resolved.  Setting this to `true` is equivalent to
   * setting `resolvedTimestamp` to the current time, and setting this to
   * `false` is equivalent to setting `resolvedTimestamp` to `null`.
   */
  resolved?: boolean;
}

export type ListThreadQueryParameters = {
  /**
   * Threads will be matched against the filters specified.
   * This is a partial match, which means any keys other than the ones you specify are ignored
   * when checking for a match. Please note that because this is a query parameter in a REST API,
   * this JSON object must be URI encoded before being sent.
   */
  filter?: FilterParameters;
};
