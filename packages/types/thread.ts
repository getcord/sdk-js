import type {
  EntityMetadata,
  FilterParameters,
  ListenerRef,
  Location,
  MessageID,
  OrganizationID,
  PaginationParams,
  ThreadID,
  UserID,
} from './core';
import type {
  ClientMessageData,
  CoreMessageData,
  SearchResultData,
} from './message';

/**
 * Options for the `observeLocationSummary` function in the Thread API.
 */
export interface ObserveThreadActivitySummaryOptions {
  /**
   * If `true`, perform [partial
   * matching](https://docs.cord.com/reference/location#Partial-Matching) on the
   * specified location. If `false`, fetch information for only exactly the
   * location specified.
   *
   * If unset, defaults to `false`.
   */
  partialMatch?: boolean;
}

export type ObserveThreadActivitySummaryHookOptions = {
  partialMatch?: boolean;
};

/**
 * A summary of the activity within a single thread.
 */
export interface ThreadActivitySummary {
  /**
   * The total number of threads at the
   * [location](https://docs.cord.com/reference/location), both resolved and
   * unresolved.
   */
  total: number;

  /**
   * The total number of threads that contain *at least one* unread message in
   * the thread.
   *
   * This will count all threads with unread messages at the location, whether
   * the current user is subscribed to the thread or not.
   */
  unread: number;

  /**
   * The number of threads that have messages the current user hasn't seen yet
   * and is subscribed to.
   *
   * A user is automatically subscribed to threads relevant to them, for example
   * because they have sent a message or have been \@-mentioned in them.
   * `unreadSubscribed` is always less than or equal to `unread`.
   */
  unreadSubscribed: number;

  /**
   * The total number of threads that the user has never seen before at all,
   * i.e., *every* message in the thread is unread.
   *
   * This will count all threads with unread messages at the location, whether
   * the current user is subscribed to the thread or not.
   */
  new: number;

  /**
   * The number of resolved threads. This refers to threads that users have
   * manually marked as resolved within Cord's UI components.
   */
  resolved: number;
}

export type ThreadActivitySummaryUpdateCallback = (
  summary: ThreadActivitySummary,
) => unknown;

/**
 * @deprecated All functions in this interface have been renamed.
 */
export interface ICordActivitySDK {
  /**
   * @deprecated Renamed to sdk.thread.observeLocationSummary.
   */
  observeThreadSummary(
    ...args: Parameters<ICordThreadSDK['observeLocationSummary']>
  ): ReturnType<ICordThreadSDK['observeLocationSummary']>;

  /**
   * @deprecated Renamed to sdk.thread.unobserveLocationSummary.
   */
  unobserveThreadSummary(
    ...args: Parameters<ICordThreadSDK['unobserveLocationSummary']>
  ): ReturnType<ICordThreadSDK['unobserveLocationSummary']>;
}

export type ThreadParticipant = {
  /**
   * The timestamp of the most recent message or reaction that this user has
   * seen in this thread. Is `null` if this participant has never viewed this
   * thread.
   */
  lastSeenTimestamp: Date | null;

  /**
   * The user ID of the participant. Can be null if the current viewer no longer
   * shares an [organization](https://docs.cord.com/rest-apis/organizations)
   * with this participant (and therefore can no longer access that
   * participant's information).
   */
  userID: UserID | null;
};

export interface CoreThreadData {
  /**
   * The ID for this thread.
   */
  id: ThreadID;

  /**
   * The organization ID this thread is in.
   */
  organizationID: OrganizationID;

  /**
   * The total number of messages in this thread.
   */
  total: number;

  /**
   * Whether this thread is resolved. This is equivalent to checking if
   * `resolvedTimestamp` is null.
   */
  resolved: boolean;

  /**
   * The timestamp when this thread was resolved. Set to `null` if this thread
   * is not resolved.
   */
  resolvedTimestamp: Date | null;

  /**
   * All of the users who are engaging in this thread. This includes both subscribed and unsubscribed users.
   */
  participants: ThreadParticipant[];

  /**
   * All of the users who are subscribed to this thread.
   */
  subscribers: UserID[];

  /**
   * All of the users who have replied to this thread.
   */
  repliers: UserID[];

  /**
   * The users that are currently typing in this thread.  Typing status is
   * transient in nature, so the value is the set of users typing at a
   * particular instant, but may change rapidly.
   */
  typing: UserID[];

  /**
   * The name of the thread.  This is shown to users when the thread is
   * referenced, such as in notifications.  This should generally be something
   * like the page title.
   */
  name: string;

  /**
   * A URL where the thread can be seen.  This determines where a user is sent
   * when they click on a reference to this thread, such as in a notification,
   * or if they click on a reference to a message in the thread and the message
   * doesn't have its own URL.
   */
  url: string;

  /**
   * The [location](https://docs.cord.com/reference/location) of this thread.
   */
  location: Location;

  /**
   * Arbitrary key-value pairs that can be used to store additional information.
   */
  metadata: EntityMetadata;

  /**
   * An optional space separated list of classnames to add to the thread.
   */
  extraClassnames: string | null;
}

/**
 * A summary of a single thread.
 */
export interface ThreadSummary
  extends Omit<CoreThreadData, 'resolvedTimestamp'> {
  /**
   * The number of messages that the current user hasn't seen yet.
   */
  unread: number;
  /**
   * Whether the current viewer has either left a message or reacted to this thread.
   */
  viewerIsThreadParticipant: boolean;
  /**
   * Contains information about the first (i.e., oldest) message in the thread.
   * `null` if the thread is empty.
   */
  firstMessage: ClientMessageData | null;
  /**
   * Contains information about the last (i.e., newest) message in the thread.
   * `null` if the thread is empty.
   */
  lastMessage: ClientMessageData | null;
}

export type ThreadSummaryUpdateCallback = (summary: ThreadSummary) => unknown;

/**
 * Options for the `observeThreadSummary` and `observeThreadData` functions in
 * the Thread API.
 */
export interface ThreadObserverOptions {
  /**
   * Loading information for a thread ID which does not exist will create that
   * thread. If that happens, this will be the name of the new thread.
   *
   * If unset, this will default to the current page's title.
   */
  threadName?: string;
  /**
   * Loading information for a thread ID which does not exist will create that
   * thread. If that happens, this will be the
   * [location](https://docs.cord.com/reference/location) of the new thread.
   *
   * If unset, this will default to the location provided to the
   * [`useCordLocation`](https://docs.cord.com/js-apis-and-hooks/initialization#useCordLocation)
   * hook if that was used. Otherwise, will default to the current page's URL.
   */
  location?: Location;
}

export type ObserveThreadSummaryOptions = ThreadObserverOptions;
export type ObserveThreadDataOptions = ThreadObserverOptions;

export type ThreadListFilter = { metadata?: EntityMetadata };
export type SortDirection = 'ascending' | 'descending';
export type SortBy =
  | 'first_message_timestamp'
  | 'most_recent_message_timestamp';
export type ObserveLocationDataOptions = {
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  includeResolved?: boolean;
  partialMatch?: boolean;
  /**
   * An object that can be used to filter the threads returned.  Currently
   * the only valid key is `metadata`. The value for a `metadata` entry should
   * be an object representing the metadata key/value to filter on.  For
   * example, to show only threads with the metadata key of `"category"`
   * set to `"sales"`, set the filter to `{ metadata: { category: "sales" } }`.
   */
  filter?: ThreadListFilter;
};

export type LocationData = PaginationParams & {
  threads: ThreadSummary[];
};
export type LocationDataCallback = (data: LocationData) => unknown;

export interface ClientUpdateThread
  extends Partial<
    Pick<
      CoreThreadData,
      'name' | 'url' | 'metadata' | 'resolved' | 'extraClassnames'
    >
  > {
  /**
   * Whether the thread is resolved.  Setting this to `true` is equivalent to
   * setting `resolvedTimestamp` to the current time, and setting this to
   * `false` is equivalent to setting `resolvedTimestamp` to `null`.
   */
  resolved?: boolean;
}

export interface ClientCreateThread
  extends Pick<CoreThreadData, 'location' | 'url' | 'name'>,
    Partial<
      Omit<
        CoreThreadData,
        // Required fields
        | 'location'
        | 'url'
        | 'name'
        // Non-create fields
        | 'id'
        | 'organizationID'
        | 'total'
        | 'resolved'
        | 'resolvedTimestamp'
        | 'participants'
        | 'repliers'
        | 'typing'
      >
    > {}

export interface ClientCreateMessage
  // Pick the required properties
  extends Pick<CoreMessageData, 'content'>,
    // Then a partial version of the rest of the properties
    Partial<
      Omit<
        CoreMessageData,
        | 'authorID'
        | 'id'
        | 'content'
        | 'organizationID'
        | 'threadID'
        | 'plaintext'
        | 'createdTimestamp'
        | 'updatedTimestamp'
        | 'deletedTimestamp'
        | 'reactions'
      >
    > {
  /**
   * The parameters for creating a thread if the supplied thread doesn't exist
   * yet.  If the thread doesn't exist but `createThread` isn't provided, the
   * call will generate an error.  This value is ignored if the thread already
   * exists.
   */
  createThread?: ClientCreateThread;
  /**
   * A list of unicode strings representing the reactions you want to add to this message.
   * Trying to create a reaction that already exists for a user does nothing.
   */
  addReactions?: string[];
}

export interface ClientUpdateMessage
  extends Partial<Omit<ClientCreateMessage, 'createThread'>> {
  /**
   * Whether to change the deleted status of this message.
   */
  deleted?: boolean;
  /**
   * A list of unicode strings representing the reactions you want to remove from this message.
   * Removing a reaction that does not exist will have no effect and will not return an error.
   * An error is returned if a reaction is both added and deleted in the same request.
   */
  removeReactions?: string[];
}

export interface ICordThreadSDK {
  /**
   * This method allows you to observe summary information about a
   * [location](https://docs.cord.com/reference/location), including live
   * updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.thread.observeLocationSummary(
   *   {page: 'document_details'},
   *   (summary) => {
   *      // Received an update!
   *      console.log("Total threads", summary.total);
   *      console.log("Unread threads", summary.unread);
   *      console.log("Unread subscribed threads", summary.unreadSubscribed);
   *      console.log("Resolved threads", summary.resolved);
   *   },
   *   {partialMatch: true}
   * );
   * // ... Later, when updates are no longer needed ...
   * window.CordSDK.thread.unobserveLocationSummary(ref);
   * ```
   * @param location - The [location](https://docs.cord.com/reference/location)
   * to fetch summary information for.
   * @param callback - This callback will be called once with the current
   * location summary, and then again every time the data changes. The argument
   * passed to the callback is an object which will contain the fields described
   * under "Available Data" above.
   * @param options - Options that control which threads are returned.
   * @returns A reference number which can be passed to
   * `unobserveLocationSummary` to stop observing location summary information.
   */
  observeLocationSummary(
    location: Location,
    callback: ThreadActivitySummaryUpdateCallback,
    options?: ObserveThreadActivitySummaryOptions,
  ): ListenerRef;
  unobserveLocationSummary(ref: ListenerRef): boolean;

  observeLocationData(
    location: Location,
    callback: LocationDataCallback,
    options?: ObserveLocationDataOptions,
  ): ListenerRef;
  unobserveLocationData(ref: ListenerRef): boolean;

  /**
   * This method allows you to observe summary information about a thread, such
   * as its location and number of unread messages, including live updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.thread.observeThreadSummary(
   *   'my-awesome-thread-id',
   *   (summary) => {
   *     // Received an update!
   *     console.log("Total messages", summary.total);
   *     console.log("Unread messages", summary.unread);
   *   },
   * );
   * // ... Later, when updates are no longer needed ...
   * window.CordSDK.thread.unobserveThreadSummary(ref);
   * ```
   * @param threadId - The thread ID to fetch summary information for. If a
   * thread with this ID does not exist, it will be created.
   * @param callback - This callback will be called once with the current thread
   * summary, and then again every time the data changes. The argument passed to
   * the callback is an object which will contain the fields described under
   * "Available Data" above.
   * @param options - Options for creating new threads.
   * @returns A reference which can be passed to `unobserveThreadSummary` to
   * stop observing thread summary information.
   */
  observeThreadSummary(
    threadId: ThreadID,
    callback: ThreadSummaryUpdateCallback,
    options?: ObserveThreadSummaryOptions,
  ): ListenerRef;
  unobserveThreadSummary(ref: ListenerRef): boolean;

  /**
   * This method allows you to observe detailed data about a thread, including
   * data about all the messages inside it, including live updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.thread.observeThreadData(
   *   'my-awesome-thread-id',
   *   ({ messages, loading, hasMore, fetchMore }) => {
   *     console.log('Got a thread data update:');
   *     if (loading) {
   *       console.log('Loading...');
   *     }
   *     messages.forEach((messageSummary) =>
   *       console.log(`Message ${messageSummary.id} was created at ${messageSummary.createdTimestamp}!`),
   *     );
   *     if (!loading && hasMore && messages.length < 25) {
   *       // Get the first 25 threads, 10 at a time.
   *       fetchMore(10);
   *     }
   *   },
   * );
   * // ... Later, when updates are no longer needed ...
   * window.CordSDK.thread.unobserveThreadData(ref);
   * ```
   * @param threadId - The thread ID to fetch data for. If a thread with this ID
   * does not exist, it will be created.
   * @param callback - This callback will be called once with the current thread
   * data, and then again every time it changes. The argument passed to the
   * callback is an object which will contain the fields described under
   * "Available Data" above.
   * @param options - Options for creating new threads.
   * @returns A reference number which can be passed to `unobserveThreadData` to
   * stop observing thread data.
   */
  observeThreadData(
    threadId: ThreadID,
    callback: ThreadDataCallback,
    options?: ObserveThreadDataOptions,
  ): ListenerRef;
  unobserveThreadData(ref: ListenerRef): boolean;

  /**
   * Set the subscribed status for an existing thread for the current user. A
   * subscribed user will be notified of any new thread activity.
   * @example Overview
   * ```
   * await window.CordSDK.thread.setSubscribed('my-awesome-thread-id', false);
   * ```
   * @param threadID - The ID of the thread.
   *
   * @param subscribed - Whether the user should be subscribed to the thread.
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  setSubscribed(threadID: ThreadID, subscribed: boolean): Promise<true>;

  /**
   * Mark whether the whole thread, i.e. all the messages in the thread, are seen
   * or unseen for the current user.  This does not affect whether the user is
   * subscribed to the thread or not.
   * @example Overview
   * ```
   * // To mark a thread as unseen
   * await window.CordSDK.thread.setSeen('my-awesome-thread-id', false);
   *
   * // To mark a thread as seen
   * await window.CordSDK.thread.setSeen('my-awesome-thread-id', true);
   * ```
   * @param threadID - The ID of the thread.
   *
   * @param seen - Whether the thread should now be seen (true) or unseen (false).
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  setSeen(threadID: ThreadID, seen: boolean): Promise<true>;

  /**
   * Update an existing thread with new data.
   * @example Overview
   * ```javascript
   * await window.CordSDK.thread.updateThread('my-awesome-thread-id', {
   *   location: { page: 'document_details' },
   *   name: 'A more awesome name',
   * });
   * ```
   * @param threadID - The ID of the thread to update.
   * @param data - The data values that should be updated.
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  updateThread(threadID: ThreadID, data: ClientUpdateThread): Promise<true>;

  /**
   * Add a new message to a thread.  The message will be authored by the current
   * user and belong to their current organization.
   * @example Overview
   * ```javascript
   * await window.CordSDK.thread.sendMessage(
   *   'my-awesome-thread-id',
   *   crypto.randomUUID(),
   *   {
   *     content: [{ type: 'p', children: [{ text: 'Amazing job!' }]}],
   *   }
   * );
   * ```
   * @param threadID - The ID of the thread to add the message to.  If this
   * thread does not yet exist, the `createThread` parameter determines what
   * happens.
   * @param messageID - The ID to use for the new message.  This must be unique
   * within the application.
   * @param data - The data values for the new message.
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  sendMessage(
    threadID: ThreadID,
    messageID: MessageID,
    data: ClientCreateMessage,
  ): Promise<true>;

  /**
   * Update the content or properties of an existing message.  This can only be
   * used to modify messages created by the current viewer.
   * @example Overview
   * ```javascript
   * await window.CordSDK.thread.updateMessage(
   *   'my-awesome-thread-id',
   *   'message-42',
   *   {
   *     content: [{ type: 'p', children: [{ text: 'An updated message content' }]}],
   *   }
   * );
   * ```
   * @param threadID - The ID of the thread containing the message.
   * @param messageID - The ID of the message to update.
   * @param data - The data values to update.  Any omitted values will be left
   * at their current values.
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  updateMessage(
    threadID: ThreadID,
    messageID: MessageID,
    data: ClientUpdateMessage,
  ): Promise<true>;

  /**
   * This method allows you search for messages by content.
   * @example Overview
   * ```javascript
   * await window.CordSDK.thread.searchMessages('searchTermToFind');
   * ```
   * @param textToMatch - The string you want to find in message content.
   * @returns An array containing message objects.
   */
  searchMessages(textToMatch?: string): Promise<SearchResultData[] | undefined>;
}

/**
 * Detailed data about a single thread.
 */
export interface ThreadData extends PaginationParams {
  /**
   * Contains information about the first (i.e., oldest) message in the thread.
   * `null` if the thread is empty.
   */
  firstMessage: ClientMessageData | null;
  /**
   * An array of objects, one for each message in the specified thread.
   *
   * This array is paginated. At first, it will contain summaries of only the
   * latest (newest) few messages. Calling `fetchMore` will cause further
   * message summaries to be appended to the array.
   */
  messages: ClientMessageData[];
}
export type ThreadDataCallback = (data: ThreadData) => unknown;

/**
 * https://docs.cord.com/rest-apis/threads/
 */
export type ServerUpdateThread = Partial<
  Omit<
    CoreThreadData,
    | 'total'
    | 'participants'
    | 'typing'
    | 'resolved'
    | 'repliers'
    | 'subscribers'
  > & {
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

export interface ServerCreateThread
  extends Pick<
      CoreThreadData,
      'id' | 'location' | 'url' | 'name' | 'organizationID'
    >,
    Partial<
      Omit<
        CoreThreadData,
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

export type ServerListThreadParameters = {
  /**
   * Threads will be matched against the filters specified.
   * This is a partial match, which means any keys other than the ones you specify are ignored
   * when checking for a match. Please note that because this is a query parameter in a REST API,
   * this JSON object must be URI encoded before being sent.
   */
  filter?: FilterParameters;
};
