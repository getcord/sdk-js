import type { EntityMetadata } from '@cord-sdk/types';
import type { CreateThreadVariables } from './thread';

export interface MessageVariables {
  /**
   * The ID for the message.
   */
  id: string;
  /**
   * The ID for the user that sent the message.
   */
  authorID: string;
  /**
   * The ID for the organization this message belongs to.
   */
  organizationID: string;
  /**
   * The ID for the thread this message is part of.
   */
  threadID: string;
  /**
   * The content of the message.
   */
  content: object[];
  /**
   * A URL where the message can be seen.  This determines where a user is sent
   * when they click on a reference to this message, such as in a notification.
   * If unset, it defaults to the thread's URL.
   */
  url: string | null;
  /**
   * The timestamp when this message was created.  The default value is the
   * current time.
   */
  createdTimestamp: Date | null;
  /**
   * The timestamp when this message was deleted, if it was.  If unset, the
   * message is not deleted.
   */
  deletedTimestamp: Date | null;
  /**
   * The timestamp when this message was last edited, if it ever was.  If unset,
   * the message does not show as edited.
   */
  updatedTimestamp: Date | null;
  /**
   * The URL of the icon to show next to the message.  This is only used for
   * `action_message` messages; other messages show the avatar of the author.
   * If an `action_message` does not have an icon set, no icon is shown.
   * @format uri
   */
  iconURL: string | null;
  /**
   * The type of message this is.  A `user_message` is a message that the author
   * sent.  An `action_message` is a message about something that happened, such
   * as the thread being resolved.  The default value is `user_message`.
   */
  type: 'action_message' | 'user_message';
  /**
   * Arbitrary key-value pairs that can be used to store additional information.
   */
  metadata: EntityMetadata;
}

export interface CreateMessageVariables
  // Pick the required properties
  extends Pick<MessageVariables, 'authorID' | 'id' | 'content'>,
    // Then a partial version of the rest of the properties
    Partial<
      Omit<
        MessageVariables,
        'authorID' | 'id' | 'content' | 'organizationID' | 'threadID'
      >
    > {
  /**
   * The parameters for creating a thread if the supplied thread doesn't exist
   * yet.  If the thread doesn't exist but `createThread` isn't provided, the
   * call will generate an error.  This value is ignored if the thread already
   * exists.
   */
  createThread?: Omit<CreateThreadVariables, 'id'>;
}

export interface UpdateMessageVariables
  extends Partial<Omit<CreateMessageVariables, 'authorID' | 'createThread'>> {
  /**
   * Whether we want to mark this message as deleted. Setting this to `true` without
   * providing a value for `deletedTimestamp` is equivalent to setting `deletedTimestamp` to current
   * time and setting this to `false` is equivalent to setting `deletedTimestamp` to `null`.
   */
  deleted?: boolean;
  /**
   * The timestamp when this message was deleted, if it was. If set to null, the message is not deleted.
   * Deleting a message this way will only soft delete it, replacing the content of the message with a
   * record of the deletion on the frontend. If you'd like to permanently delete it instead, use the
   * [delete message endpoint](https://docs.cord.com/reference/rest-api/messages#Delete-a-message).
   */
  deletedTimestamp?: Date | null;
}
