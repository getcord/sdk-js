import type {
  EntityMetadata,
  NotificationVariables,
  UUID,
  UserData,
} from '@cord-sdk/types';
import type { NotificationReplyAction } from './notifications';
import type { ThreadVariables } from './thread';

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
    usersToNotify: (UserData & {
      replyActions: NotificationReplyAction[] | null;
    })[];
    messageType: 'action_message' | 'user_message';
    metadata: EntityMetadata;
    thread: Omit<ThreadVariables, 'organizationID'>;
  };
  'notification-created': NotificationVariables & {
    recipientUserID: string;
  };
}
