import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';
import type {
  ComposerProps,
  SendButtonProps,
} from '../../canary/composer/Composer.js';
import type {
  AvatarFallbackProps,
  AvatarProps,
  AvatarTooltipProps,
} from './Avatar.tsx';

import type { OverlayProps } from './Overlay.tsx';
import type { FacepileProps } from './Facepile.tsx';
import type { PresenceFacepileProps } from './PresenceFacepile.tsx';
import type { PagePresenceProps } from './PagePresence.tsx';
import type { GeneralButtonProps } from './helpers/Button.tsx';
import type {
  OptionsMenuProps,
  OptionsMenuTooltipProps,
} from './menu/OptionsMenu.tsx';
import type { MenuProps } from './menu/Menu.tsx';
import type { MessageFilesAttachmentsProps } from './message/MessageFilesAttachments.tsx';
import type { MediaModalProps } from './MediaModal.tsx';
import type { MessageUserReferenceElementProps } from './message/MessageUserReferenceElement.tsx';
import type { MessageTextProps } from './message/MessageText.tsx';
import type { MessageContentProps } from './message/MessageContent.tsx';
import type { MenuItemProps } from './menu/MenuItem.tsx';
import type { SeparatorProps } from './helpers/Separator.tsx';
import type { MessageActionsProps } from './menu/MessageActions.tsx';

export type ReplaceConfig = ReplaceConfigBase & ReplaceWithin;

export type ReplaceConfigBase = Partial<{
  Replace: React.ComponentType<object>;
  Avatar: React.ComponentType<AvatarProps>;
  AvatarFallback: React.ComponentType<AvatarFallbackProps>;
  AvatarTooltip: React.ComponentType<AvatarTooltipProps>;
  Facepile: React.ComponentType<FacepileProps>;
  PresenceFacepile: React.ComponentType<PresenceFacepileProps>;
  AddReactionButton: React.ComponentType<GeneralButtonProps>;
  Button: React.ComponentType<GeneralButtonProps>;
  PagePresence: React.ComponentType<PagePresenceProps>;
  OptionsMenu: React.ComponentType<OptionsMenuProps>;
  OptionsMenuTooltip: React.ComponentType<OptionsMenuTooltipProps>;
  Menu: React.ComponentType<MenuProps>;
  MenuItem: React.ComponentType<MenuItemProps>;
  Overlay: React.ComponentType<OverlayProps>;
  MessageFilesAttachments: React.ComponentType<MessageFilesAttachmentsProps>;
  MediaModal: React.ComponentType<MediaModalProps>;
  MessageUserReferenceElement: React.ComponentType<MessageUserReferenceElementProps>;
  MessageText: React.ComponentType<MessageTextProps>;
  MessageContent: React.ComponentType<MessageContentProps>;
  MessageActions: React.ComponentType<MessageActionsProps>;
  Separator: React.ComponentType<SeparatorProps>;
  Composer: React.ComponentType<ComposerProps>;
  SendButton: React.ComponentType<SendButtonProps>;
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
