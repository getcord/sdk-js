import cx from 'classnames';

import {
  Archive,
  ArrowBendDownRight,
  ArrowCircleUpRight,
  ArrowSquareOut,
  ArrowsInSimple,
  At,
  Bell,
  BellSlash,
  CaretLeft,
  CaretRight,
  Chats,
  ChatText,
  Check,
  Checks,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  Code,
  Copy,
  DotsThree,
  EnvelopeSimple,
  Export,
  EyeSlash,
  Faders,
  File,
  FileAudio,
  FileCsv,
  FileDoc,
  FilePdf,
  FileText,
  FileVideo,
  FileXls,
  FileZip,
  Gear,
  Hash,
  ImageSquare,
  LinkSimple,
  MagnifyingGlass,
  MicrosoftWordLogo,
  MegaphoneSimple,
  Moon,
  Paperclip,
  PencilSimpleLine,
  Question,
  Smiley,
  Square,
  Sun,
  TextAa,
  Trash,
  Tray,
  UserCirclePlus,
  Users,
  WarningCircle,
  X,
} from 'phosphor-react';

import * as React from 'react';
import { ArrowUpIcon as ArrowUp } from '../../common/icons/customIcons/ArrowUpIcon';
import { ArrowRightIcon as ArrowRight } from '../../common/icons/customIcons/ArrowRightIcon';
import { HelpIcon as Help } from '../../common/icons/customIcons/HelpIcon';
import { AddEmojiIcon as AddEmoji } from '../../common/icons/customIcons/AddEmojiIcon';
import { AnnotationPinIcon as AnnotationPin } from '../../common/icons/customIcons/AnnotationPinIcon';
import { AssignIcon as Assign } from '../../common/icons/customIcons/AssignIcon';
import { ChatAddIcon as ChatAdd } from '../../common/icons/customIcons/ChatAddIcon';
import { CursorIcon as Cursor } from '../../common/icons/customIcons/CursorIcon';
import { SlackIcon as Slack } from '../../common/icons/customIcons/SlackIcon';
import { SlackColourIcon as SlackColour } from '../../common/icons/customIcons/SlackColourIcon';
import { AsanaIcon as Asana } from '../../common/icons/customIcons/AsanaIcon';
import { LinearIcon as Linear } from '../../common/icons/customIcons/LinearIcon';
import { JiraIcon as Jira } from '../../common/icons/customIcons/JiraIcon';
import { MondayIcon as Monday } from '../../common/icons/customIcons/MondayIcon';
import { stripStyleProps } from '../../common/ui/styleProps';
import type { UIProps } from '../../common/ui/styleProps';
import { DownSolidIcon as DownSolid } from '../../common/icons/customIcons/DownSolidIcon';
import { UpSolidIcon as UpSolid } from '../../common/icons/customIcons/UpSolidIcon';
import { ClipboardIcon as Clipboard } from '../../common/icons/customIcons/ClipboardIcon';
import { LauncherIcon as Launcher } from '../../common/icons/customIcons/LauncherIcon';
import { FaceIcon as Face } from '../../common/icons/customIcons/FaceIcon';
import { WinkSmileyRectIcon as WinkSmileyRect } from '../../common/icons/customIcons/WinkSmileyRectIcon';
import { WinkSmileyCircleIcon as WinkSmileyCircle } from '../../common/icons/customIcons/WinkSmileyCircleIcon';
import { ReturnArrowIcon as ReturnArrow } from '../../common/icons/customIcons/ReturnArrow';

import classes from './Icon.css';

// Icon names must be unique across PHOSPHOR_ICONS and CORD_ICONS - e.g. can't
// have an icon called 'Settings' in both
const PHOSPHOR_ICONS = {
  Archive,
  ArrowBendDownRight,
  ArrowCircleUpRight,
  ArrowSquareOut,
  ArrowsInSimple,
  At,
  Bell,
  BellSlash,
  CaretLeft,
  CaretRight,
  Chats,
  ChatText,
  Check,
  Checks,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  Code,
  Copy,
  DotsThree,
  EnvelopeSimple,
  Export,
  EyeSlash,
  Faders,
  File,
  FileAudio,
  FileCsv,
  FileDoc,
  FilePdf,
  FileText,
  FileVideo,
  FileXls,
  FileZip,
  Gear,
  Hash,
  ImageSquare,
  LinkSimple,
  MagnifyingGlass,
  MicrosoftWordLogo,
  MegaphoneSimple,
  Moon,
  Paperclip,
  PencilSimpleLine,
  Question,
  Smiley,
  Square,
  Sun,
  TextAa,
  Trash,
  Tray,
  UserCirclePlus,
  Users,
  WarningCircle,
  X,
};

// Icon names must be unique across PHOSPHOR_ICONS and CORD_ICONS - e.g. can't
// have an icon called 'Settings' in both
const CUSTOM_ICONS = {
  AddEmoji,
  AnnotationPin,
  Assign,
  ChatAdd,
  ArrowRight,
  ArrowUp,
  Clipboard,
  Cursor,
  DownSolid,
  Slack,
  SlackColour,
  Asana,
  Linear,
  Jira,
  Monday,
  UpSolid,
  Launcher,
  Face,
  Help,
  WinkSmileyCircle,
  WinkSmileyRect,
  ReturnArrow,
};

const ALL_ICONS = { ...PHOSPHOR_ICONS, ...CUSTOM_ICONS };

export type IconType = keyof typeof ALL_ICONS;

type IconProps = UIProps<
  'svg',
  'marginPadding' | 'color',
  {
    name: IconType;
    size?: 'small' | 'large';
  }
>;

export function Icon({
  name,
  color = 'content-emphasis',
  size = 'small',
  className,
  ...otherProps
}: IconProps) {
  const { propsExStyleProps: elementProps } = stripStyleProps({
    color,
    ...otherProps,
  });

  const IconComponent = ALL_ICONS[name];

  const isPhosphorIcon = name in PHOSPHOR_ICONS;

  return (
    <IconComponent
      className={cx(
        classes.icon,
        size === 'large' ? classes.large : classes.medium,
        className,
      )}
      weight={isPhosphorIcon ? 'light' : undefined}
      {...elementProps}
    />
  );
}

export const newIcon = {
  NewComp: Icon,
  configKey: 'icon',
} as const;