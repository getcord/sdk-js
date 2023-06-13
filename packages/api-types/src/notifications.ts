import type {
  EntityMetadata,
  NotificationVariables as NotificationVariables_,
} from '@cord-sdk/types';

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

export type NotificationVariables = NotificationVariables_;
