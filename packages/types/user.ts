import type {
  EntityMetadata,
  FilterParameters,
  ID,
  ListenerRef,
  OrganizationID,
  PaginationParams,
  UserID,
} from './core';
import type { PaginationDetails } from './pagination';

/**
 * The data associated with a Cord user.
 */
export interface ClientUserData {
  /**
   * The user's ID.  This is unique within an application.
   */
  id: UserID;
  /**
   * The user's name.
   */
  name: string | null;
  /**
   * The user's short name.  In most cases, Cord components will prefer using
   * this name over `name` when set.
   */
  shortName: string | null;
  /**
   * A URL to the user's profile picture.
   */
  profilePictureURL: string | null;
  /**
   * Any metadata that has been set for the user.
   */
  metadata: EntityMetadata;
}

/**
 * The data associated with the Cord user that's currently logged in.
 */
export interface ViewerUserData extends ClientUserData {
  /**
   * The identifier for the organization that the current user is using (i.e.,
   * the organization specified in the access token). Null if and only if no
   * organization was specified in the access token.
   */
  organizationID: OrganizationID | null;
  notificationPreferences: { sendViaSlack: boolean; sendViaEmail: boolean };
}

export type SingleUserUpdateCallback = (user: ClientUserData | null) => unknown;
export type MultipleUserUpdateCallback = (
  users: Record<string, ClientUserData | null>,
) => unknown;
export type ViewerUserUpdateCallback = (user: ViewerUserData) => unknown;

export type OrgMembersData = PaginationParams & {
  orgMembers: ClientUserData[];
};
export type OrgMembersDataCallback = (data: OrgMembersData) => unknown;

/**
 * Options for the `observeOrgMembers` function in the User API.
 */
export type ObserveOrgMembersOptions = {
  /**
   * The organization to search for.  The viewer must be a member of the
   * organization in order to receive its data.  If omitted, the API will
   * fetch the members of the org the viewer is currently logged in with, i.e.
   * the one that is specified in their access token.
   */
  organizationID?: string;
};

/**
 * The notification preferences for a user.
 */
export type NotificationPreferences = {
  /**
   * Whether notifications should be sent via slack.
   */
  sendViaSlack: boolean;
  /**
   * Whether notifications should be sent via email.
   */
  sendViaEmail: boolean;
};

export interface ICordUserSDK {
  /**
   * This method allows you to set notification preferences for the current viewer.
   * @example Overview
   * ```javascript
   * window.CordSDK.user.setNotificationPreferences({ sendViaSlack: true, sendViaEmail: true});
   * ```
   * @param preferences - An object with two optional properties, `sendViaSlack` and `sendViaEmail`,
   * to specify the new notification preferences for the viewer.
   * @returns A promise that resolves to `true` if the operation succeeded or
   * rejects if it failed.
   */
  setNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<true>;
  /**
   * This method allows you to observe data about a user, including live
   * updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.user.observeUserData(userID, callback);
   * window.CordSDK.user.unobserveUserData(ref);
   * ```
   * @example Usage
   * ```javascript
   * const ref = window.CordSDK.user.observeUserData(
   *   'user-123',
   *   (data) => {
   *     // Received an update!
   *     console.log("User name", data.name);
   *     console.log("User short name", data.shortName);
   *     console.log("User profile picture URL", data.profilePictureURL);
   *   }
   * );
   * ```
   * @param userID - The user to fetch data for.
   * @param callback - This callback will be called once with the current data,
   * and then again every time the data changes.  The argument passed to the
   * callback is an object which will contain the fields described under
   * "Available Data" above.  If there's no user with that ID, the callback will
   * be called with `null`.
   * @returns A reference number which can be passed to `unobserveUserData` to
   * stop observing user data.
   */
  observeUserData(
    userID: UserID,
    callback: SingleUserUpdateCallback,
  ): ListenerRef;
  /**
   * This method allows you to observe data about multiple users, including live
   * updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.user.observeUserData(userIDs, callback);
   * window.CordSDK.user.unobserveUserData(ref);
   * ```
   * @example Usage
   * ```javascript
   * const ref = window.CordSDK.user.observeUserData(
   *   ['user-123', 'user-456'],
   *   (data) => {
   *     // Received an update!
   *     console.log("User-123 name", data['user-123']?.name);
   *     console.log("User-456 name", data['user-456']?.name);
   *   }
   * );
   * ```
   * @param userIDs - The list of user IDs to fetch data for.
   * @param callback - This callback will be called once with the current data,
   * and then again every time the data changes.  The argument passed to the
   * callback is an object with a property for each requested user ID.  If the
   * property is missing, the data for that user has not yet been loaded; if
   * there's no user with that ID, it will be `null`; and otherwise it will be
   * an object which will contain the fields described under "Available Data"
   * above.
   * @returns A reference number which can be passed to `unobserveUserData` to
   * stop observing user data.
   */
  observeUserData(
    userIDs: Array<UserID>,
    callback: MultipleUserUpdateCallback,
  ): ListenerRef;
  unobserveUserData(ref: ListenerRef): boolean;

  /**
   * This method allows you to observe data about the logged-in user, including
   * live updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.user.observeViewerData(
   *   (data) => {
   *     // Received an update!
   *     console.log("User name", data.name);
   *     console.log("User short name", data.shortName);
   *     console.log("User profile picture URL", data.profilePictureURL);
   *     console.log("Organization ID", data.organizationID);
   *   }
   * );
   * ```
   * @param callback - This callback will be called once with the current data,
   * and then again every time the data changes.  The argument passed to the
   * callback is an object which will contain the fields described under
   * "Available Data" above.
   * @returns A reference number which can be passed to `unobserveViewerData` to
   * stop observing the data.
   */
  observeViewerData(callback: ViewerUserUpdateCallback): ListenerRef;
  unobserveViewerData(ref: ListenerRef): boolean;

  /**
   * This method allows you to observe the members of an org the current user is
   * a member of - either the current org the viewer is logged into, or, if
   * specified as an option, another org the viewer is a member of.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.user.observeOrgMembers(
   *   (data) =>  ({ orgMembers, loading, hasMore, fetchMore }) => {
   *     console.log('Got an org members update:');
   *     if (loading) {
   *       console.log('Loading...');
   *     }
   *     orgMembers.forEach((orgMember) =>
   *       console.log(`Org member ${orgMember.id} is called ${orgMember.name}!`),
   *     );
   *     if (!loading && hasMore && orgMembers.length < 25) {
   *       // Get the first 25 org members, 10 at a time.
   *       fetchMore(10);
   *     }
   *   },
   *   {organizationID: 'org123'}
   * );
   * ```
   * @param callback - This callback will be called once with the current data,
   * and then again every time the data changes.  The argument passed to the
   * callback is an object which will contain the fields described under
   * "Available Data" above.
   * @param options - An object of filters.
   * @returns A reference number which can be passed to `unobserveOrgMembers` to
   * stop observing the data.
   */
  observeOrgMembers(
    callback: OrgMembersDataCallback,
    options?: ObserveOrgMembersOptions,
  ): ListenerRef;
  unobserveOrgMembers(ref: ListenerRef): boolean;
}

export interface ServerUserData {
  /**
   * Provided ID for the user
   *
   */
  id: ID;

  /**
   * Email address
   *
   * @format email
   */
  email: string | null;

  /**
   * Full user name
   */
  name: string | null;

  /**
   * Short user name. In most cases, this will be preferred over name when set.
   */
  shortName: string | null;

  /**
   * @deprecated alias for shortName.
   */
  short_name: string | null;

  status: 'active' | 'deleted';

  /**
   * This must be a valid URL, which means it needs to follow the usual URL
   * formatting and encoding rules. For example, any space character will need
   * to be encoded as `%20`. We recommend using your programming language's
   * standard URL encoding function, such as `encodeURI` in Javascript.
   *
   * @format uri
   */
  profilePictureURL: string | null;

  /**
   * Alias for profilePictureURL. This field is deprecated.
   *
   * @deprecated
   *
   * @format uri
   */
  profile_picture_url: string | null;

  /**
   * User's first name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  first_name: string | null;

  /**
   * User's last name. This field is deprecated and has no effect.
   *
   * @deprecated
   */
  last_name: string | null;

  /**
   * Arbitrary key-value pairs that can be used to store additional information.
   */
  metadata: EntityMetadata;

  /**
   * Creation timestamp
   */
  createdTimestamp: Date | null;
}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export type ServerUpdateUser = Partial<
  Omit<ServerUserData, 'id' | 'createdTimestamp'>
>;

/**
 * @deprecated type for deprecated api route
 */
export type ServerCreateUser = ServerUpdateUser &
  Required<Pick<ServerUserData, 'id'>>;

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface ServerListUser extends Omit<ServerUserData, 'email'> {
  email: string | null;
}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface ServerGetUser extends ServerListUser {
  /**
   * List of organizations the user is a member of.
   */
  organizations: ID[];
}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export interface ServerListUsers {
  users: ServerListUser[];
  pagination: PaginationDetails;
}

export type ServerListUserParameters = {
  /**
   * Number of users to return.
   */
  limit?: number;

  /**
   * Pagination token. This is returned in the `pagination` object of a previous response.
   */
  token?: string;

  /**
   * This is a JSON object with one optional entry.  Users will be matched
   * against the filter specified. This is a partial match, which means any keys
   * other than the ones you specify are ignored when checking for a match.
   * Please note that because this is a query parameter in a REST API, this JSON
   * object must be URI encoded before being sent.
   */
  filter?: Pick<FilterParameters, 'metadata'>;
};

export interface ServerDeleteUser {
  /**
   * The user will be deleted only if this value is true.
   */
  permanently_delete: boolean;
}
