import type { EntityMetadata, ListenerRef, PaginationParams } from './core';

export type NotificationSummary = {
  unread: number;
};

export type NotificationSummaryUpdateCallback = (
  summary: NotificationSummary,
) => unknown;

/**
 * An attachment representing a URL.
 */
type NotificationURLAttachment = {
  /**
   * Indicator that this is a URL attachment.
   */
  type: 'url';

  /**
   * The URL this attachment points to. This would typically be the URL to send
   * the browser to if this notification is clicked.
   */
  url: string;
};

/**
 * An attachment representing a message.
 */
type NotificationMessageAttachment = {
  /**
   * Indicator that this is a message attachment.
   */
  type: 'message';

  /**
   * The ID of the message attached to this notification. For example, if this
   * is a notification about being @-mentioned, this is the ID of the message
   * containing that @-mention.
   */
  messageID: string;

  /**
   * The ID of the thread that the above message is in.
   */
  threadID: string;
};

/**
 * A header node representing a basic string.
 */
type NotificationTextHeader = {
  /**
   * The text to display. This text may start and/or end with whitespace, which
   * should typically *not* be trimmed. For example, in order to display the
   * notification `"Alice replied to your thread."`, this would typically be
   * composed of two nodes -- a user node for Alice, and then a text node
   * containing `" replied to your thread."`, with a meaningful space at the
   * front, to separate this node from Alice's name.
   */
  text: string;

  /**
   * Whether the text should be formatted in bold.
   */
  bold: boolean;
};

/**
 * A header node representing a reference to a specific user.
 */
type NotificationUserHeader = {
  /**
   * The user referenced. This node would typically be rendered by displaying
   * this user's name.
   */
  userID: string;
};

export interface NotificationVariables {
  /**
   * The [ID](https://docs.cord.com/reference/identifiers) for this notification.
   */
  id: string;

  /**
   * The [IDs](https://docs.cord.com/reference/identifiers) of the user(s) who
   * sent this notification. The Cord backend will sometimes aggregate multiple
   * notifications together, causing them to have multiple senders. For example,
   * if multiple people react to the same message, that will generate only one
   * notification (but with multiple senders, one for each person who reacted).
   */
  senderUserIDs: string[];

  /**
   * The URL of an icon image for this notification, if one was specified when
   * it was created. This will always be `null` for Cord's internally-generated
   * notifications (i.e., it can only be non-null for notifications you create
   * via the REST API).
   */
  iconUrl: string | null;

  /**
   * The "header" or "text" of the notification. This will represent text like
   * "Alice replied to your thread." or similar. For notifications you create
   * via the REST API, this will be based upon the `template` parameter, see
   * below.
   */
  header: (NotificationTextHeader | NotificationUserHeader)[];

  /**
   * Additional context attached to the notification. For example, if this
   * notification is about a new reaction on a message, the attachment will
   * specify what message received that new reaction.
   *
   * A renderer will typically check the `type` field of the attachment and
   * render that attachment type below the `header`.
   */
  attachment: NotificationURLAttachment | NotificationMessageAttachment | null;

  /**
   * Whether this notification has been read by the recipient yet.
   */
  readStatus: 'unread' | 'read';

  /**
   * The time this notification was sent.
   */
  timestamp: Date;

  /**
   * An arbitrary JSON object specified when the notification was created. This
   * will always be an empty object for Cord's internally-generated
   * notifications (i.e., it can only be non-null for notifications you create
   * via the REST API).
   */
  metadata: EntityMetadata;
}

export interface NotificationData extends PaginationParams {
  /**
   * The current user's notifications, in reverse-chronological order (i.e.,
   * newest first). Calling `fetchMore` will load a batch of older notifications
   * and append them to this list. Any new notifications that are sent to the
   * current viewer will automatically be prepended to this list.
   */
  notifications: NotificationVariables[];
}

export type NotificationDataUpdateCallback = (
  data: NotificationData,
) => unknown;

export interface ICordNotificationSDK {
  observeSummary(
    callback: NotificationSummaryUpdateCallback,
    options?: Record<never, string>,
  ): ListenerRef;
  unobserveSummary(ref: ListenerRef): boolean;

  /**
   * This method allows you to observe the full notification data for the current
   * user, including live updates.
   *
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.notification.observeData(callback);
   * window.CordSDK.notification.unobserveData(ref);
   * ```
   *
   * @example Usage
   * ```javascript
   * const ref = window.CordSDK.notification.observeData(
   *   ({ notifications, loading, hasMore, fetchMore }) => {
   *     console.log('Got a notifications data update:');
   *     if (loading) {
   *       console.log('Loading...');
   *     }
   *     threads.forEach((notification) =>
   *       console.log(\`Got notification \${notification.id}!\`),
   *     );
   *     if (!loading && hasMore && notifications.length < 25) {
   *       // Get the first 25 notifications, 10 at a time.
   *       fetchMore(10);
   *     }
   *   }
   * );
   * ```
   *
   * @param callback - This callback will be called once with the current
   * notification data, and then again every time the data changes. The argument
   * passed to the callback is an object which will contain the fields described
   * under "Available Data" above.
   *
   * @returns A reference number which can be passed to `unobserveData` to stop
   * observing notification data information.
   */
  observeData(callback: NotificationDataUpdateCallback): ListenerRef;
  unobserveData(ref: ListenerRef): boolean;

  /**
   * @deprecated Renamed to observeSummary.
   */
  observeNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['observeSummary']>
  ): ReturnType<ICordNotificationSDK['observeSummary']>;

  /**
   * @deprecated Renamed to unobserveSummary.
   */
  unobserveNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['unobserveSummary']>
  ): ReturnType<ICordNotificationSDK['unobserveSummary']>;
}
