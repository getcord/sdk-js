import type { EntityMetadata } from '@cord-sdk/types';

/**
 * https://docs.cord.com/reference/rest-api/notifications
 */
export type CreateNotificationVariables = {
  /**
   * ID of user who is the "actor" sending the notification, i.e., the user
   * taking the action the notification is about.
   *
   * Required if `template` includes `{{actor}}`.
   */
  actorID?: string;

  /**
   * @deprecated alias for actorID.
   */
  actor_id?: string;

  /**
   * ID of user receiving the notification.
   */
  recipientID?: string;

  /**
   * @deprecated alias for recipientID.
   */
  recipient_id?: string;

  /**
   * Template for the header of the notification. The expressions `{{actor}}`
   * and `{{recipient}}` will be replaced respectively with the notification's
   * actor and recipient. (See below for an example.)
   */
  template: string;

  /**
   * URL of page to go to when the notification is clicked.
   */
  url: string;

  /**
   * URL of an icon image if a specific one is desired. For notifications with
   * an `actor_id` this will default to the sender's profile picture, otherwise
   * it will default to a bell icon.
   */
  iconUrl?: string;

  /**
   * Currently must be set to `url`. In the future this may specify different
   * types of notifications, but for now only `url` is defined.
   */
  type: 'url';

  /**
   * An arbitrary JSON object that can be used to set additional metadata on the
   * notification. When displaying a [list of
   * notifications](https://docs.cord.com/components/cord-notification-list),
   * you can filter the list by metadata value.
   *
   * Keys are strings, and values can be strings, numbers or booleans.
   */
  metadata?: EntityMetadata;
};

/**
 * An attachment representing a URL.
 */
export type NotificationURLAttachment = {
  /**
   * The URL this attachment points to. This would typically be the URL to send
   * the browser to if this notification is clicked.
   */
  url: string;
};

/**
 * An attachment representing a message.
 */
export type NotificationMessageAttachment = {
  /**
   * The ID of the message attached to this notification. For example, if this
   * is a notification about being @-mentioned, this is the ID of the message
   * containing that @-mention.
   */
  messageID: string;
};

/**
 * A header node representing a basic string.
 */
export type NotificationTextHeader = {
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
export type NotificationUserHeader = {
  /**
   * The user referenced. This node would typically be rendered by displaying
   * this user's name.
   */
  userID: string;
};

export type NotificationVariables = {
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
};
