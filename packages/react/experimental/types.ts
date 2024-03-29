import type {
  ClientCreateThread,
  ClientMessageData,
  MessageContent,
} from '@cord-sdk/types';
import type { CustomEditor } from '../slateCustom.js';

export type StyleProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'style' | 'className'
>;

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
