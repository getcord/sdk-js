import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';
import type {
  ComposerProps,
  MessageProps,
  AvatarProps,
  AvatarFallbackProps,
  AvatarTooltipProps,
} from '../../experimental/types.js';
import type { TextEditorProps } from '../../canary/composer/TextEditor.js';
import type { ComposerLayoutProps } from '../../canary/composer/ComposerLayout.js';
import type { ToolbarLayoutProps } from '../../canary/composer/ToolbarLayout.js';
import type { MessageLayoutProps } from '../../canary/message/MessageLayout.js';
import type {
  ThreadHeaderProps,
  ThreadProps,
} from '../../canary/thread/Thread.js';
import type { SendButtonProps } from '../../canary/composer/SendButton.js';
import type {
  UsernameProps,
  UsernameTooltipProps,
} from '../../canary/message/Username.js';
import type { MessageTombstoneProps } from '../../canary/message/MessageTombstone.js';
import type { ActionMessageProps } from '../../canary/message/ActionMessage.js';
import type { ResolvedThreadComposerProps } from '../../canary/composer/ResolvedThreadComposer.js';
import type { CloseComposerButtonProps } from '../../canary/composer/CloseComposerButton.js';
import type { ReopenThreadButtonProps } from '../../canary/composer/ReopenThreadButton.js';
import type { ThreadSeenByProps } from '../../canary/thread/ThreadSeenBy.js';
import type { SendMessageErrorProps } from '../../canary/composer/SendMessageError.js';
import type { OverlayProps } from './Overlay.js';
import type { FacepileProps } from './Facepile.js';
import type { PresenceFacepileProps } from './PresenceFacepile.js';
import type { PagePresenceProps } from './PagePresence.js';
import type { GeneralButtonProps } from './helpers/Button.js';
import type {
  OptionsMenuProps,
  OptionsMenuTooltipProps,
} from './menu/OptionsMenu.js';
import type { MenuButtonProps, MenuProps } from './menu/Menu.js';
import type { MessageFilesAttachmentsProps } from './message/MessageFilesAttachments.js';
import type { MediaModalProps } from './MediaModal.js';
import type { MessageUserReferenceElementProps } from './message/MessageUserReferenceElement.js';
import type { MessageTextProps } from './message/MessageText.js';
import type { MessageContentProps } from './message/MessageContent.js';
import type { MenuItemProps } from './menu/MenuItem.js';
import type { SeparatorProps } from './helpers/Separator.js';
import type { MessageActionsProps } from './menu/MessageActions.js';
import type { TimestampProps } from './Timestamp.js';
import type { EmojiPickerProps } from './helpers/EmojiPicker.js';
import type { ReactionsProps } from './Reactions.js';
import type { ReactionPickButtonProps } from './ReactionPickButton.js';
import type { ErrorFallbackProps } from './ErrorFallback.js';
import type { MentionListProps } from './composer/MentionList.js';

export type ReplaceConfig = ReplaceConfigBase & ReplaceWithin;

export type ReplaceConfigBase = Partial<{
  ActionMessage: React.ComponentType<ActionMessageProps>;
  Avatar: React.ComponentType<AvatarProps>;
  AvatarFallback: React.ComponentType<AvatarFallbackProps>;
  AvatarTooltip: React.ComponentType<AvatarTooltipProps>;
  Button: React.ComponentType<GeneralButtonProps>;
  CloseComposerButton: React.ComponentType<CloseComposerButtonProps>;
  Composer: React.ComponentType<ComposerProps>;
  ComposerLayout: React.ComponentType<ComposerLayoutProps>;
  EmojiPicker: React.ComponentType<EmojiPickerProps>;
  ErrorFallback: React.ComponentType<ErrorFallbackProps>;
  Facepile: React.ComponentType<FacepileProps>;
  MediaModal: React.ComponentType<MediaModalProps>;
  MentionList: React.ComponentType<MentionListProps>;
  Menu: React.ComponentType<MenuProps>;
  MenuButton: React.ComponentType<MenuButtonProps>;
  MenuItem: React.ComponentType<MenuItemProps>;
  Message: React.ComponentType<MessageProps>;
  MessageActions: React.ComponentType<MessageActionsProps>;
  MessageContent: React.ComponentType<MessageContentProps>;
  MessageFilesAttachments: React.ComponentType<MessageFilesAttachmentsProps>;
  MessageLayout: React.ComponentType<MessageLayoutProps>;
  MessageText: React.ComponentType<MessageTextProps>;
  MessageTombstone: React.ComponentType<MessageTombstoneProps>;
  MessageUserReferenceElement: React.ComponentType<MessageUserReferenceElementProps>;
  OptionsMenu: React.ComponentType<OptionsMenuProps>;
  OptionsMenuTooltip: React.ComponentType<OptionsMenuTooltipProps>;
  Overlay: React.ComponentType<OverlayProps>;
  PagePresence: React.ComponentType<PagePresenceProps>;
  PresenceFacepile: React.ComponentType<PresenceFacepileProps>;
  ReactionButton: React.ComponentType<ReactionPickButtonProps>;
  Reactions: React.ComponentType<ReactionsProps>;
  ReopenThreadButton: React.ComponentType<ReopenThreadButtonProps>;
  Replace: React.ComponentType<object>;
  ResolvedThreadComposer: React.ComponentType<ResolvedThreadComposerProps>;
  SendButton: React.ComponentType<SendButtonProps>;
  SendMessageError: React.ComponentType<SendMessageErrorProps>;
  Separator: React.ComponentType<SeparatorProps>;
  TextEditor: React.ComponentType<TextEditorProps>;
  Thread: React.ComponentType<ThreadProps>;
  ThreadHeader: React.ComponentType<ThreadHeaderProps>;
  ThreadSeenBy: React.ComponentType<ThreadSeenByProps>;
  Timestamp: React.ComponentType<TimestampProps>;
  ToolbarLayout: React.ComponentType<ToolbarLayoutProps>;
  Username: React.ComponentType<UsernameProps>;
  UsernameTooltip: React.ComponentType<UsernameTooltipProps>;
}>;

type ReplaceWithin = Partial<{
  within: { [name in keyof ReplaceConfigBase]?: ReplaceConfigBase };
}>;

export type ComponentName = keyof ReplaceConfigBase;
export const replaceRegistry = new Map<string, AnyWritableAtom>();

export function registerComponent<
  ReplacedComponent extends React.ComponentType<any>,
>(name: string, component: ReplacedComponent) {
  replaceRegistry.set(name, atom({ component }));
}

type AnyWritableAtom = WritableAtom<
  { component: React.ComponentType<any>; replace?: any },
  any[],
  any
>;
