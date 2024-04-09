import type {
  ClientCreateThread,
  ClientMessageData,
  ClientUserData,
  MessageContent,
  ViewerUserData,
} from '@cord-sdk/types';
import type { CustomEditor } from '../slateCustom.js';
import type { ReplacementProps } from './components/hoc/withReplacement.js';

export type WithByID<T> = {
  ByID: React.ComponentType<T>;
};

export interface WithByIDComponent<T, U>
  extends WithByID<U>,
    React.ForwardRefExoticComponent<
      T & React.RefAttributes<HTMLElement> & ReplacementProps
    > {}

export interface StyleProps {
  /**
   * Passes the style of the wrapper component.
   */
  style?: React.HTMLAttributes<HTMLDivElement>['style'];
  /**
   * Any classes to be added to the wrapper component.
   */
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

export interface SendComposerProps extends StyleProps {
  /**
   * The initial value of the composer.
   */
  initialValue?: Partial<ClientMessageData>;
  /**
   * An [arbitrary string](/reference/identifiers) that uniquely identifies a
   * thread. Messages sent will go to the provided thread ID. If the thread does not exist,
   * then the createThread prop should be passed.
   *
   * *Warning!*
   * An important restriction of working with thread identifiers
   * is that they must be unique across your entire application.
   * You can't use the same thread identifier in two separate
   * groups. This is an intentional limitation imposed by Cord.
   */
  threadId?: string;
  /**
   * An object containing the data of the thread to be created. If a threadID
   * is passed, this object will be ignored.
   */
  createThread?: ClientCreateThread;
  /**
   * Text to be displayed as a placeholder in the composer.
   */
  placeholder?: string;
  /**
   * Callback invoked before the message is sent. It receives the message data
   * as an argument and should return the modified message data. If the callback
   * returns `null`, the message will not be sent.
   */
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  /**
   * Callback invoked after the message is sent.
   */
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
  /**
   * Callback invoked when the user clicks on the cancel button in the composer.
   */
  onCancel?: () => void;
  autofocus?: boolean;
}

export interface EditComposerProps extends StyleProps {
  /**
   * The initial value of the composer.
   */
  initialValue?: Partial<ClientMessageData>;
  /**
   * An [arbitrary string](/reference/identifiers) that uniquely identifies a
   * thread.
   *
   * *Warning!*
   * An important restriction of working with thread identifiers
   * is that they must be unique across your entire application.
   * You can't use the same thread identifier in two separate
   * groups. This is an intentional limitation imposed by Cord.
   */
  threadId: string;
  /**
   * The id of the message to be edited.
   */
  messageId: string;
  /**
   * Text to be displayed as a placeholder in the composer.
   */
  placeholder?: string;
  /**
   * Callback invoked before the message is sent. It receives the message data
   * as an argument and should return the modified message data. If the callback
   * returns `null`, the message will not be sent.
   */
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  /**
   * Callback invoked after the message is sent.
   */
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
  /**
   * Callback invoked when the user clicks on the cancel button in the composer.
   */
  onCancel?: () => void;
  autofocus?: boolean;
}

export interface ComposerProps extends StyleProps {
  onSubmit: (arg: { message: Partial<ClientMessageData> }) => void;
  // TODO-ONI add cancel button
  // onCancel: () => void;
  onChange: (event: { content: MessageContent }) => void;
  onKeyDown: (event: {
    event: React.KeyboardEvent;
  }) => boolean | undefined | void;
  onCancel?: () => void;
  onResetState: () => void;
  onPaste: (e: { event: React.ClipboardEvent }) => void;
  initialValue?: Partial<ClientMessageData>;
  value: Partial<Omit<ClientMessageData, 'content'>>;
  editor: CustomEditor;
  isEmpty: boolean;
  isValid: boolean;
  placeholder?: string;
  toolbarItems?: { name: string; element: JSX.Element | null }[];
  extraChildren?: { name: string; element: JSX.Element | null }[];
  popperElement?: JSX.Element;
  popperElementVisible?: boolean;
  popperOnShouldHide?: () => void;
  groupID: string | undefined;
  autofocus?: boolean;
}

export type CordComposerProps = {
  initialValue?: Partial<ClientMessageData>;
  placeholder?: string;
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  onSubmit: (arg: { message: Partial<ClientMessageData> }) => void;
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
  onCancel?: () => void;
  groupID: string | undefined;
};

export type CommonMessageProps = StyleProps;

export type MessageProps = {
  /**
   * Contains the data of the message to be displayed.
   */
  message: ClientMessageData;
} & CommonMessageProps;

export interface AvatarProps extends StyleProps {
  /**
   * ID of the user whose avatar is to be displayed.
   */
  userId: string;
  /**
   * Whether to enable tooltip on the avatar.
   */
  enableTooltip?: boolean;
  /**
   * Whether the user is absent.
   */
  isAbsent?: boolean;
}

export type AvatarTooltipProps = {
  viewerData: ViewerUserData;
  userData: ClientUserData;
};

export type AvatarFallbackProps = {
  userData: ClientUserData;
};
