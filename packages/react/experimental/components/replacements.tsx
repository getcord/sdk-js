import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';
import type {
  AvatarFallbackProps,
  AvatarProps,
  AvatarTooltipProps,
} from './Avatar';

import type { OverlayProps } from './Overlay';
import type { FacepileProps } from './Facepile';
import type { PresenceFacepileProps } from './PresenceFacepile';
import type { PagePresenceProps } from './PagePresence';
import type { GeneralButtonProps } from './helpers/Button';
import type {
  OptionsMenuProps,
  OptionsMenuTooltipProps,
} from './menu/OptionsMenu';
import type { MenuProps } from './menu/Menu';
import type { MessageFilesAttachmentsProps } from './message/MessageFilesAttachments';
import type { MediaModalProps } from './MediaModal';
import type { MessageUserReferenceElementProps } from './message/MessageUserReferenceElement';
import type { MessageTextProps } from './message/MessageText';
import type { MessageContentProps } from './message/MessageContent';

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
  Overlay: React.ComponentType<OverlayProps>;
  MessageFilesAttachments: React.ComponentType<MessageFilesAttachmentsProps>;
  MediaModal: React.ComponentType<MediaModalProps>;
  MessageUserReferenceElement: React.ComponentType<MessageUserReferenceElementProps>;
  MessageText: React.ComponentType<MessageTextProps>;
  MessageContent: React.ComponentType<MessageContentProps>;
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
