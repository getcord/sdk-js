import type { EntityMetadata, FilterParameters } from '@cord-sdk/types';
import type { ID } from './coreTypes';

export interface PlatformUserVariables {
  /**
   * Provided ID for the user
   *
   */
  id?: ID;

  /**
   * Email address
   *
   * @format email
   */
  email: string;

  /**
   * Full user name
   */
  name?: string | null;

  /**
   * Short user name. In most cases, this will be preferred over name when set.
   */
  shortName?: string | null;

  /**
   * @deprecated alias for shortName.
   */
  short_name?: string | null;

  status?: 'active' | 'deleted';

  /**
   * This must be a valid URL, which means it needs to follow the usual URL
   * formatting and encoding rules. For example, any space character will need
   * to be encoded as `%20`. We recommend using your programming language's
   * standard URL encoding function, such as `encodeURI` in Javascript.
   *
   * @format uri
   */
  profilePictureURL?: string | null;

  /**
   * Alias for profilePictureURL. This field is deprecated.
   *
   * @deprecated
   *
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

  /**
   * Creation timestamp
   */
  createdTimestamp?: Date | null;
}

/**
 * https://docs.cord.com/rest-apis/users/
 */
export type UpdatePlatformUserVariables = Partial<
  Omit<PlatformUserVariables, 'id'>
>;

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformUserVariables = Omit<PlatformUserVariables, 'id'> &
  Required<Pick<PlatformUserVariables, 'id'>>;

export type ListUserQueryParameters = {
  /**
   * This is a JSON object with one optional entry.  Users will be matched
   * against the filter specified. This is a partial match, which means any keys
   * other than the ones you specify are ignored when checking for a match.
   * Please note that because this is a query parameter in a REST API, this JSON
   * object must be URI encoded before being sent.
   */
  filter?: Pick<FilterParameters, 'metadata'>;
};
