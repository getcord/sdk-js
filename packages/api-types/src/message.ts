import type { RestApiMessageData } from '@cord-sdk/types';
import type { CreateThreadVariables } from './thread';

export type MessageVariables = RestApiMessageData;

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
  extends Partial<Omit<CreateMessageVariables, 'createThread'>> {
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
}

export interface ListMessageParameters {
  /**
   * Return messages in ascending or descending order of creation timestamp.  'descending' is the default.
   */
  sortDirection?: 'ascending' | 'descending';
}
