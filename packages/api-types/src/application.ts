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
