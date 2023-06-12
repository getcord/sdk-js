import type { EntityMetadata } from '@cord-sdk/types';
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
   * @format uri
   */
  profilePictureURL?: string | null;

  /**
   * @deprecated alias for profilePictureURL.
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

/**
 * https://docs.cord.com/reference/rest-api/users/
 */
export type UpdatePlatformUserVariables = Partial<PlatformUserVariables>;

/**
 * @deprecated type for deprecated api route
 */
export type CreatePlatformUserVariables = PlatformUserVariables & { id: ID };
