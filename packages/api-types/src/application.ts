export interface ApplicationData {
  /**
   * The ID for the application.
   */
  id: string;
  /**
   * Name of the application
   * @minLength 1
   */
  name: string;
  /**
   * URL for the application icon. It should be a square image of 256x256. This
   * will be used as the avatar for messages and emails coming from your
   * application.  If not specified, the Cord logo will be used.
   * @format uri
   */
  iconURL: string | null;
}

/**
 * https://docs.cord.com/rest-apis/applications/
 */
export interface CreateApplicationVariables
  extends Pick<ApplicationData, 'name'>,
    Partial<Omit<ApplicationData, 'id' | 'name'>> {}

/**
 * https://docs.cord.com/rest-apis/applications/
 */
export type UpdateApplicationVariables = Partial<CreateApplicationVariables>;

export interface DeleteApplicationVariables {
  /**
   * Secret key of the application that you want to delete. This can be found
   * within the Cord Console.
   * @minLength 1
   */
  secret: string;
}
