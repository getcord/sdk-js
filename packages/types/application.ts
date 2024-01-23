export type EmailSettings = {
  /**
   * Name to show in both the subject and the body of the email.
   * Defaults to your application's name.
   */
  name: string | null;
  /**
   * URL for your logo image. The default for this is the Cord logo.
   */
  imageURL: string | null;
  /**
   * Email from which notifications for your service will be sent from.
   * This will use the provided name for your application to default to `<applicationname>-notifications@cord.fyi`.
   * @format email
   */
  sender: string | null;
  /**
   * Customization for your logo size. Providing either a height (maximum 120) or
   * width (maximum 240) will result in the image being proportionally resized to
   * fit in a container of that size. The default value is `{"width": 140}`.
   */
  logoConfig:
    | {
        /**
         * @minimum 0
         * @maximum 240
         */
        width: number;
      }
    | {
        /**
         * @minimum 0
         * @maximum 120
         */
        height: number;
      }
    | null;
};

export interface ApplicationData {
  /**
   * The ID for the application.
   */
  id: string;
  /**
   * The secret key for the application.  Please treat securely as access to this will allow someone to take
   * actions as if they are the application.
   */
  secret: string;
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
  /**
   * The URL that the events webhook is sent to
   * @format uri
   */
  eventWebhookURL: string | null;
  /**
   * Custom url link contained in email and slack notifications. These notifications are sent when a user is
   * mentioned or thread is shared and by default, the link points to the page where the conversation happened.
   * For more information, please refer to the [API docs](/customization/redirect-link)
   */
  redirectURI: string | null;
  /**
   * Email settings for notifications.
   */
  emailSettings: EmailSettings;
}

export interface ServerCreateApplication
  extends Pick<ApplicationData, 'name'>,
    Partial<Omit<ApplicationData, 'id' | 'secret' | 'name' | 'emailSettings'>> {
  emailSettings?: Partial<EmailSettings>;
}

export type ServerUpdateApplication = Partial<ServerCreateApplication>;

export interface ServerDeleteApplication {
  /**
   * Secret key of the application that you want to delete. This can be found
   * within the Cord Console.
   * @minLength 1
   */
  secret: string;
}
