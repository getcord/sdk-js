import type { NotificationPreferences } from './user';

export type ServerUpdatePreference = {
  /**
   * The preference key. `notification_channels` controls how users get notified about Cord activity.
   */
  key: 'notification_channels';
  /**
   * The updated preference value. This will update only the keys that are passed along.
   * For example, to disable Slack notification, but leave email untouched, you can use this value:
   *
   * ```json
   * {
   *    "value": { "sendViaSlack": "false" },
   * }
   * ```
   */
  value: Partial<NotificationPreferences>;
};