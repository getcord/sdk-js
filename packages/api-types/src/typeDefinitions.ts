import type {
  EntityMetadata,

  // These awkward imports and renames are for the benefit of generate.mjs which
  // doesn't spit out anything which wasn't actually defiend in this file --
  // this lets us "define" these types with their proper names in this file (via
  // importing them to these weird names and then re-defining them with their
  // actual names).
  ThreadVariables as ThreadVariables_,
  ThreadParticipant as ThreadParticipant_,
} from '@cord-sdk/types';
import type { ID } from './coreTypes';

export interface PlatformUserVariables {
  /**
   * Email address
   *
   * @format email
   */
  email: string;

  /**
   * Full user name
   */
  name?: string;

  /**
   * Short user name. In most cases, this will be preferred over name when set.
   */
  shortName?: string;

  /**
   * @deprecated alias for shortName.
   */
  short_name?: string;

  status?: 'active' | 'deleted';

  /**
   * This must be a valid URL, which means it needs to follow the usual URL
   * formatting and encoding rules. For example, any space character will need
   * to be encoded as `%20`. We recommend using your programming language's
   * standard URL encoding function, such as `encodeURI` in Javascript.
   *
   * @nullable
   * @format uri
   */
  profilePictureURL?: string | null;

  /**
   * @deprecated alias for profilePictureURL.
   * @nullable
   * @format uri
   */
  profile_picture_url?: string | null;

  /**
   * User's first name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  first_name?: string;

  /**
   * User's last name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  last_name?: string;

  /**
   * Arbitrary key-value pairs that can be used to store additional information.
   */
  metadata?: EntityMetadata;
}

export interface PlatformOrganizationVariables {
  /**
   * Organization name
   */
  name: string;

  status?: 'active' | 'deleted';

  /**
   * List of partner-specific IDs of the users who are members of this organization
   */
  members?: (string | number)[];
}

/**
 * https://docs.cord.com/reference/rest-api/users/
 */
export type UpdatePlatformUserVariables = Partial<PlatformUserVariables>;

/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export type UpdatePlatformOrganizationVariables =
  Partial<PlatformOrganizationVariables>;

/**
 * https://docs.cord.com/reference/rest-api/organizations/
 */
export interface UpdatePlatformOrganizationMembersVariables {
  add?: (string | number)[];
  remove?: (string | number)[];
}

export type ThreadVariables = ThreadVariables_;
export type ThreadParticipant = ThreadParticipant_;

/**
 * https://docs.cord.com/reference/rest-api/threads/
 */
export type UpdateThreadVariables = Partial<
  Omit<ThreadVariables, 'total' | 'participants' | 'organizationID'> & {
    /**
     * Certain changes to the thread may post a message into the thread -- in
     * particular, resolving or unresolving a thread posts a message into the
     * thread saying "User un/resolved this thread". This paramter is the ID of
     * the User who will be listed as the author of that message. It's optional
     * -- if no user is specified, then those messasges won't get posted.
     */
    userID: string;
  }
>;

/**
 * https://docs.cord.com/reference/rest-api/batch/
 */
export interface BatchAPIVariables {
  /**
   * List of user objects. Every object must include the id field. If the user
   * already exists, all other fields are optional and only updated when
   * present. If the user does not already exist, fields are required as
   * described in the [Create or update a
   * user](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 10000
   */
  users?: (UpdatePlatformUserVariables & { id: ID })[];
  /**
   * List of organization objects. Every object must include the id field. If
   * the organization already exists, all other fields are optional and only
   * updated when present. If the organization does not already exist, fields
   * are required as described in the [Create or update an
   * organization](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)
   * API.
   *
   * @maxItems 1000
   */
  organizations?: (UpdatePlatformOrganizationVariables & { id: ID })[];
}

/**
 * https://docs.cord.com/reference/authentication/
 * @additionalProperties true
 */
export interface ClientAuthTokenData {
  /**
   * Your app ID
   * @format uuid
   */
  app_id: string;
  /**
   * The ID for the user
   */
  user_id: ID;
  /**
   * The ID for the user’s organization
   */
  organization_id: ID;
  /**
   * If present, update’s the user’s details, or creates a user with those
   * details if the user_id is new to Cord. This is an object that contains the
   * same fields as the [user management REST
   * endpoint](https://docs.cord.com/reference/rest-api/users/)
   */
  user_details?: PlatformUserVariables;
  /**
   * If present, update’s the organization’s details, or creates an organization
   * with those details if the organization_id is new to Cord. This is an object
   * that contains the same fields as the [organization management REST
   * endpoint](https://docs.cord.com/reference/rest-api/organizations/)
   */
  organization_details?: PlatformOrganizationVariables;
}

/**
 * https://docs.staging.cord.com/reference/rest-api/notifications
 */
export interface CreateNotificationVariables {
  /**
   * The user sending the notification.
   */
  actorID?: string;

  /**
   * @deprecated alias for actorID.
   */
  actor_id?: string;

  /**
   * The user recieving the notification.
   */
  recipientID?: string;

  /**
   * @deprecated alias for recipientID.
   */
  recipient_id?: string;

  /**
   * Template string for the body of the notification. See
   * https://docs.staging.cord.com/reference/rest-api/notifications
   */
  template: string;

  /**
   * URL linked to when the notification is clicked.
   */
  url: string;

  /**
   * Must be set to "url".
   */
  type: 'url';

  /**
   * Metadata for the notification.
   */
  metadata?: EntityMetadata;
}

export interface CreateApplicationVariables {
  /**
   * Name of the application
   * @minLength 1
   */
  name: string;
  /**
   * URL for the application icon. It should be a square image of 256x256.
   * This will be used as the avatar for messages and emails coming from your application.
   * @format uri
   */
  iconURL?: string;
}

/**
 * https://docs.cord.com/reference/rest-api/applications/
 */
export interface UpdateApplicationVariables {
  /**
   * Name of the application
   * @minLength 1
   */
  name?: string;
  /**
   * URL for the application icon. It should be a square image of 256x256.
   * This will be used as the avatar for messages and emails coming from your application.
   * @format uri
   */
  iconURL?: string;
}

export interface DeleteApplicationVariables {
  /**
   * Secret key of the application that you want to delete. This can be found
   * within the Cord Console.
   * @minLength 1
   */
  secret: string;
}

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformUserVariables = PlatformUserVariables & { id: ID };

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformOrganizationVariables =
  PlatformOrganizationVariables & { id: ID };

export interface CreateMessageVariables {
  id: string;
  authorID: string;
  content: object[];
  url?: string;
  createdTimestamp?: Date | undefined;
  deletedTimestamp?: Date | undefined;
  updatedTimestamp?: Date | undefined;
  location?: string;
}
