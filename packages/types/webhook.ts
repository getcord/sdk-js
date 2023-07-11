import type {
  NotificationReplyAction,
  ThreadVariables,
} from '@cord-sdk/api-types';
import type {
  EntityMetadata,
  NotificationVariables,
  UUID,
  UserData,
} from '@cord-sdk/types';

// Typing of the payloads we send to clients
export interface WebhookPayloads {
  'thread-message-added': {
    // TODO: deprecate as moved to thread object
    threadID: string;
    messageID: string;
    // TODO: deprecate in favour of organizationID
    orgID: string;
    organizationID: string;
    applicationID: UUID;
    author: UserData;
    content: object[];
    plaintext: string;
    url: string;
    messageType: 'action_message' | 'user_message';
    usersToNotify: UsersToNotify[];
    metadata: EntityMetadata;
    thread: Omit<ThreadVariables, 'organizationID'>;
  };
  'notification-created': NotificationCreatedWebhookPayload;
}

export interface UsersToNotify extends UserData {
  replyActions: NotificationReplyAction[] | null;
}

export interface NotificationCreatedWebhookPayload
  extends NotificationVariables {
  recipientUserID: string;
}
