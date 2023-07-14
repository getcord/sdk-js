import type {
  EntityMetadata,
  ListenerRef,
  OrganizationID,
  UserID,
} from './core';

/**
 * The data associated with a Cord user.
 */
export interface UserData {
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
export interface ViewerUserData extends UserData {
  /**
   * The identifier for the organization that the current user is using.
   */
  organizationID: OrganizationID;
  notificationPreferences: { sendViaSlack: boolean; sendViaEmail: boolean };
}

export type SingleUserUpdateCallback = (user: UserData | null) => unknown;
export type MultipleUserUpdateCallback = (
  users: Record<string, UserData | null>,
) => unknown;
export type ViewerUserUpdateCallback = (user: ViewerUserData) => unknown;

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
   * @returns A promise that can be used to check the status of the request.
   */
  setNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<void>;
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
}
