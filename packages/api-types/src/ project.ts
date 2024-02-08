import type {
  ServerCreateProject,
  ServerUpdateProject,
  ServerDeleteProject,
} from '@cord-sdk/types';

/**
 * https://docs.cord.com/rest-apis/applications/
 */
export interface CreateProjectVariables extends ServerCreateProject {}
/**
 * https://docs.cord.com/rest-apis/applications/
 */
export interface UpdateProjectVariables extends ServerUpdateProject {}
/**
 * https://docs.cord.com/rest-apis/applications/
 */
export interface DeleteProjectVariables extends ServerDeleteProject {}
