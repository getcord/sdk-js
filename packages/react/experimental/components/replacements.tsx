import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';
import type {
  SendComposerProps,
  SendButtonProps,
} from '../../canary/composer/Composer.js';
import type { MessageLayoutProps, MessageProps } from '../../canary/Message.js';
import type { ThreadHeaderProps, ThreadProps } from '../../canary/Thread.js';
import type {
  AvatarFallbackProps,
  AvatarProps,
  AvatarTooltipProps,
} from './Avatar.js';

import type { OverlayProps } from './Overlay.js';
import type { FacepileProps } from './Facepile.js';
import type { PresenceFacepileProps } from './PresenceFacepile.js';
import type { PagePresenceProps } from './PagePresence.js';
import type { GeneralButtonProps } from './helpers/Button.js';
import type {
  OptionsMenuProps,
  OptionsMenuTooltipProps,
} from './menu/OptionsMenu.js';
import type { MenuProps } from './menu/Menu.js';
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
import type { AddReactionButtonProps } from './AddReactionButton.js';

export type ReplaceConfig = ReplaceConfigBase & ReplaceWithin;

export type ReplaceConfigBase = Partial<{
  Replace: React.ComponentType<object>;
  Avatar: React.ComponentType<AvatarProps>;
  AvatarFallback: React.ComponentType<AvatarFallbackProps>;
  AvatarTooltip: React.ComponentType<AvatarTooltipProps>;
  Facepile: React.ComponentType<FacepileProps>;
  PresenceFacepile: React.ComponentType<PresenceFacepileProps>;
  AddReactionButton: React.ComponentType<AddReactionButtonProps>;
  Button: React.ComponentType<GeneralButtonProps>;
  PagePresence: React.ComponentType<PagePresenceProps>;
  OptionsMenu: React.ComponentType<OptionsMenuProps>;
  OptionsMenuTooltip: React.ComponentType<OptionsMenuTooltipProps>;
  Menu: React.ComponentType<MenuProps>;
  MenuItem: React.ComponentType<MenuItemProps>;
  Overlay: React.ComponentType<OverlayProps>;
  Message: React.ComponentType<MessageProps>;
  MessageLayout: React.ComponentType<MessageLayoutProps>;
  MessageFilesAttachments: React.ComponentType<MessageFilesAttachmentsProps>;
  MediaModal: React.ComponentType<MediaModalProps>;
  MessageUserReferenceElement: React.ComponentType<MessageUserReferenceElementProps>;
  MessageText: React.ComponentType<MessageTextProps>;
  MessageContent: React.ComponentType<MessageContentProps>;
  MessageActions: React.ComponentType<MessageActionsProps>;
  Separator: React.ComponentType<SeparatorProps>;
  Composer: React.ComponentType<SendComposerProps>;
  SendButton: React.ComponentType<SendButtonProps>;
  Timestamp: React.ComponentType<TimestampProps>;
  EmojiPicker: React.ComponentType<EmojiPickerProps>;
  Reactions: React.ComponentType<ReactionsProps>;
  Thread: React.ComponentType<ThreadProps>;
  ThreadHeader: React.ComponentType<ThreadHeaderProps>;
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
