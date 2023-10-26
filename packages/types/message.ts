import type { EntityMetadata, UserID, Location, TimestampRange } from './core';
import type { PaginationDetails } from './pagination';
import type {
  CreateAttachment,
  RemoveAttachment,
  ServerCreateThread,
} from './thread';
import type { UploadedFile } from './file';

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

export type ServerAddReactions = Omit<Reaction, 'timestamp'> &
  Partial<Pick<Reaction, 'timestamp'>>;

export type ServerRemoveReactions = Omit<Reaction, 'timestamp'>;

/**
 * A file attached to this message.
 */
export interface MessageFileAttachment extends UploadedFile {
  /**
   * The type of this attachment, which is always `file` for file attachments.
   */
  type: 'file';
}

/**
 * The screenshot attached to this message.
 */
export interface MessageScreenshotAttachment {
  /**
   * The type of this attachment, which is always `screenshot` for screenshot attachments.
   */
  type: 'screenshot';
  /**
   * The screenshot attached to the message. Screenshots are attached via `screenshotOptions.captureWhen`
   * API.
   */
  screenshot: UploadedFile;
}

/**
 * An annotation attached to this message.
 */
export interface MessageAnnotationAttachment {
  /**
   * The type of this attachment, which is always `annotation` for annotation attachments.
   */
  type: 'annotation';
  /**
   * The screenshot attached to the annotation.
   */
  screenshot: UploadedFile;
  /**
   * (Optional) The text that was selected when creating the annotation.
   */
  textContent: string | null;
}

export type MessageAttachment =
  | MessageFileAttachment
  | MessageAnnotationAttachment
  | MessageScreenshotAttachment;

export interface CoreMessageData {
  /**
   * The ID for the message.  If a message is created with no ID, a random
   * UUID-based ID will be automatically created for it.
   */
  id: string;
  /**
   * The ID for the user that sent the message.
   */
  authorID: string;
  /**
   * The ID for the organization this message belongs to.
   * @deprecated Use groupID instead.
   */
  organizationID: string;
  /**
   * The ID for the group this message belongs to.
   */
  groupID: string;
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
  /**
   * A list of IDs of the users that have seen the message.
   */
  seenBy: string[];
}

export interface ClientMessageData extends CoreMessageData {
  /**
   * Whether the message has been seen by the current viewer.
   */
  seen: boolean;
}
export type MessageCallback = (
  data: ClientMessageData | null | undefined,
) => unknown;

export interface SearchResultData extends ClientMessageData {
  location: Location;
}

export interface SearchOptionsType {
  /**
   * The string you want to find in message content.
   */
  textToMatch?: string;
  /**
   * The user ID of the person who sent the message.
   */
  authorID?: string;
  /**
   * The org ID of the organization the message belongs to.
   * If omitted, the search will be across all orgs the current user is a member of.
   * @deprecated Use groupID instead.
   */
  orgID?: string;
  /**
   * The ID of the group the message belongs to.
   * If omitted, the search will be across all groups the current user is a member of.
   */
  groupID?: string;
  /**
   * Arbitrary key-value pairs of data associated with the message.
   */
  metadata?: EntityMetadata;
  /**
   * Location to filter the messages by.
   *
   * Set locationOptions.location to a specific thread location to search.
   * If locationOptions.partialMatch is `true`, we perform [partial
   * matching](https://docs.cord.com/reference/location#Partial-Matching) on the
   * specified location. If `false`, we fetch information only from the
   * specified location.
   * @returns An array containing message objects.
   */
  locationOptions?: { location: Location; partialMatch: boolean };
  /**
   * Optional date objects used to scope search.
   */
  timestampRange?: TimestampRange;
}

export interface ServerCreateMessage
  // Pick the required properties
  extends Pick<CoreMessageData, 'authorID' | 'content'>,
    // Then a partial version of the rest of the properties
    Partial<
      Omit<
        CoreMessageData,
        // Required fields
        | 'authorID'
        | 'content'
        // Fields that are readonly
        | 'organizationID'
        | 'groupID'
        | 'threadID'
        | 'plaintext'
        | 'reactions'
        | 'attachments'
        | 'seenBy'
      >
    > {
  /**
   * The reactions you want to add to this message.
   * The default timestamp is the current time.
   * Trying to create a reaction that already exists for a user does nothing.
   * Doing the same as before with a timestamp will update the reaction with the new timestamp.
   * The reaction users need to be an [active member of the group](https://docs.cord.com/rest-apis/groups#Update-group-members) that the message and thread belong to.
   */
  addReactions?: ServerAddReactions[];
  /**
   * A list of attachments to add to the message.  The same file cannot be
   * attached to the same message multiple times.
   */
  addAttachments?: CreateAttachment[];
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
  removeReactions?: ServerRemoveReactions[];
  /**
   * The attachments you want to remove from this message.  Removing an
   * attachment that doesn't exist has no effect and won't return an error.
   * Attempting to add and remove the same attachment in one request is an
   * error.
   */
  removeAttachments?: RemoveAttachment[];
}

export interface ServerListThreadMessageParameters {
  /**
   * Return messages in ascending or descending order of creation timestamp.  'descending' is the default.
   */
  sortDirection?: 'ascending' | 'descending';
}

export type ServerListMessageFilter = {
  /**
   * Arbitrary key-value pairs of data associated with the message.
   */
  metadata?: EntityMetadata;
  /**
   * The [location](https://docs.cord.com/reference/location) of the thread containing the message.
   */
  location?: string;
};
export interface ServerListMessageParameters {
  /**
   * Number of messages to return. Defaults to 1000.
   */
  limit?: number;

  /**
   * Pagination token. This is returned in the `pagination` object of a previous response.
   */
  token?: string;

  /**
   * Messages will be matched against the filters specified.
   * This is a partial match, which means any keys other than the ones you specify are ignored
   * when checking for a match. Please note that because this is a query parameter in a REST API,
   * this JSON object must be URI encoded before being sent.
   */
  filter?: ServerListMessageFilter;
}

export interface ServerListMessages {
  /**
   * Page containing messages.
   */
  messages: CoreMessageData[];
  /**
   * Data related to cursor-based pagination.
   */
  pagination: PaginationDetails;
}
