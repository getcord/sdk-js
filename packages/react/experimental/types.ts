import type {
  ClientCreateThread,
  ClientMessageData,
  ClientUserData,
  MessageContent,
  ViewerUserData,
} from '@cord-sdk/types';
import type { CustomEditor } from '../slateCustom.js';

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
  initialValue?: Partial<ClientMessageData>;
  threadId?: string;
  createThread?: ClientCreateThread;
  placeholder?: string;
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
  onCancel?: () => void;
  autofocus?: boolean;
}

export interface EditComposerProps extends StyleProps {
  initialValue?: Partial<ClientMessageData>;
  threadId: string;
  messageId: string;
  placeholder?: string;
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
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

export type MessageProps = {
  /**
   * Contains the data of the message to be displayed.
   */
  message: ClientMessageData;
} & StyleProps;

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
