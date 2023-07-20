import type { EntityMetadata } from './core';

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

export interface RestApiMessageData {
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
}

export interface MessageData extends RestApiMessageData {
  /**
   * Whether the message has been seen by the current viewer.
   */
  seen: boolean;
}
