import type { EntityMetadata, UserID } from './core';
import type { ServerCreateThread } from './thread';

export type Reaction = {
  /**
   * The emoji reaction.
   */
  reaction: string;
  /**
   * The ID of the user who reacted to the message.
   */
  userID: UserID;
  /**
   *  The timestamp of when the reaction was created.
   */
  timestamp: Date;
};

export type AddReactionsVariables = Omit<Reaction, 'timestamp'> &
  Partial<Pick<Reaction, 'timestamp'>>;

/**
 * A file attached to this message.
 */
export interface MessageFileAttachment {
  /**
   * The ID of this attachment.
   */
  id: string;
  /**
   * The type of this attachment, which is always `file` for file attachments.
   */
  type: 'file';
  /**
   * The name of the file that was attached.
   */
  name: string;
  /**
   * The URL that a user can use to download the file.  This is a signed URL
   * that will expire after 24 hours.
   */
  url: string;
  /**
   * The MIME type of the file.
   */
  mimeType: string;
  /**
   * The size of the file, in bytes.
   */
  size: number;
  /**
   * The status of the file upload.  `uploading` means that the user has not yet
   * completed uploading the file, `uploaded` means the file is successfully
   * uploaded, `failed` means the upload encountered an error, and `cancelled`
   * means the user cancelled the upload before it was finished.
   */
  uploadStatus: 'uploading' | 'uploaded' | 'failed' | 'cancelled';
}

export type MessageAttachment = MessageFileAttachment;

export interface CoreMessageData {
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
   * A plaintext version of the structured message content.
   */
  plaintext: string;
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
  createdTimestamp: Date;
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
  /**
   * A optional space separated list of classnames to add to the message.
   */
  extraClassnames: string | null;
  /**
   * The items attached to this message.
   */
  attachments: MessageAttachment[];
  /**
   * The reactions to this message.
   */
  reactions: Reaction[];
}

export interface ClientMessageData extends CoreMessageData {
  /**
   * Whether the message has been seen by the current viewer.
   */
  seen: boolean;
}

export interface ServerCreateMessage
  // Pick the required properties
  extends Pick<CoreMessageData, 'authorID' | 'id' | 'content'>,
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
      >
    > {
  /**
   * The reactions you want to add to this message.
   * The default timestamp is the current time.
   * Trying to create a reaction that already exists for a user does nothing.
   * Doing the same as before with a timestamp will update the reaction with the new timestamp.
   * The reaction users need to be an [active member of the org](https://docs.cord.com/rest-apis/organizations#Update-organization-members) that the message and thread belong to.
   *
   */
  addReactions?: AddReactionsVariables[];
  /**
   * The parameters for creating a thread if the supplied thread doesn't exist
   * yet.  If the thread doesn't exist but `createThread` isn't provided, the
   * call will generate an error.  This value is ignored if the thread already
   * exists.
   */
  createThread?: Omit<ServerCreateThread, 'id'>;
}

export interface ServerUpdateMessage
  extends Partial<Omit<ServerCreateMessage, 'createThread'>> {
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
   * [delete message endpoint](https://docs.cord.com/rest-apis/messages#Delete-a-message).
   */
  deletedTimestamp?: Date | null;
  /**
   * The reactions you want to remove from this message.
   * Removing a reaction that does not exist will have no effect and will not return an error.
   * An error is returned if a reaction is both added and deleted in the same request.
   */
  removeReactions?: Omit<Reaction, 'timestamp'>[];
}

export interface ServerListMessageParameters {
  /**
   * Return messages in ascending or descending order of creation timestamp.  'descending' is the default.
   */
  sortDirection?: 'ascending' | 'descending';
}
