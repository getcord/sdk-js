import type {
  ServerUpdateOrganizationMembers,
  ServerCreateOrganization,
  ServerUpdateOrganization,
} from '@cord-sdk/types';

/**
 * https://docs.cord.com/rest-apis/organizations/
 */
export interface UpdatePlatformOrganizationVariables
  extends ServerUpdateOrganization {}

/**
 * https://docs.cord.com/rest-apis/organizations/
 */
export interface UpdatePlatformOrganizationMembersVariables
  extends ServerUpdateOrganizationMembers {}

/**
 * https://docs.cord.com/rest-apis/organizations/
 */
export interface CreatePlatformOrganizationVariables
  extends ServerCreateOrganization {}
