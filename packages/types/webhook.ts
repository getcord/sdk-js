import type { NotificationReplyAction } from '@cord-sdk/api-types';
import type {
  CoreThreadData,
  CoreMessageData,
  EntityMetadata,
  NotificationVariables,
  UUID,
  UserData,
} from '@cord-sdk/types';

// Typing of the payloads we send to clients
export interface WebhookPayloads {
  'thread-message-added': ThreadMessageAddedWebhookPayload;
  'notification-created': NotificationCreatedWebhookPayload;
  'url-verification': URLVerificationWebhookPayload;
}

export interface ThreadMessageAddedWebhookPayload {
  // TODO: deprecate all of these as they have been regrouped into new message
  // and thread fields, below
  threadID: string;
  messageID: string;
  orgID: string;
  organizationID: string;
  applicationID: UUID; // exception: this one will be moved to higher level (see postEvent)
  author: UserData;
  content: object[];
  plaintext: string;
  url: string;
  messageType: 'action_message' | 'user_message';
  metadata: EntityMetadata;
  // new format/things that can stay the same
  message: WebhookMessage;
  thread: CoreThreadData;
  usersToNotify: UsersToNotify[];
}

// Need to be split out to help the docs type extraction script
export interface WebhookMessage extends Omit<CoreMessageData, 'authorID'> {
  author: UserData;
}

export interface UsersToNotify extends UserData {
  replyActions: NotificationReplyAction[] | null;
}

export interface NotificationCreatedWebhookPayload
  extends NotificationVariables {
  recipientUserID: string;
}

export interface URLVerificationWebhookPayload {
  message: string;
}

export type WebhookTypes = keyof WebhookPayloads;

export interface WebhookWrapperProperties<T extends WebhookTypes> {
  /**
   * The type of event.  The contents of the event property will vary depending
   * on the event type.  See https://docs.cord.com/reference/events-webhook#Events-2
   * for more detail about the body of each event type.
   */
  type: string;
  /**
   * The time at which this event was sent.
   */
  timestamp: string;
  /**
   * The ID for the application this event belongs to.
   */
  applicationID: string;
  /**
   * The body of the event, which will vary depending on event type.
   * See https://docs.cord.com/reference/events-webhook#Events-2 for more
   * detail about the body of each event type.
   */
  event: WebhookPayloads[T];
}
