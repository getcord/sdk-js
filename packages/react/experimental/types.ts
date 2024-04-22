import type {
  ClientCreateThread,
  ClientMessageData,
  ClientUserData,
  MessageContent,
  ViewerUserData,
  Location,
  ClientThreadData,
} from '@cord-sdk/types';
import type { CustomEditor } from '../slateCustom.js';
import type { ReplacementProps } from './components/hoc/withReplacement.js';

export type ByID<T> = T & React.RefAttributes<HTMLElement> & ReplacementProps;

export type WithByID<T> = {
  ByID: React.ComponentType<ByID<T>>;
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

export interface SendComposerProps extends StyleProps, ReplacementProps {
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
  threadID?: string;
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
  onFailSubmit?: (error: unknown) => void;
}

export interface EditComposerProps extends StyleProps, ReplacementProps {
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
  threadID: string;
  /**
   * The id of the message to be edited.
   */
  messageID: string;
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
  onFailSubmit?: (error: unknown) => void;
}

export interface ComposerProps extends StyleProps {
  onSubmit: (arg: { message: Partial<ClientMessageData> }) => Promise<void>;
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
  onFailSubmit?: (error: unknown) => void;
}

export type CordComposerProps = {
  initialValue?: Partial<ClientMessageData>;
  placeholder?: string;
  onBeforeSubmit?: (arg: {
    message: Partial<ClientMessageData>;
  }) => { message: Partial<ClientMessageData> } | null;
  onSubmit: (arg: {
    message: Partial<ClientMessageData>;
  }) => Promise<void> | void;
  onAfterSubmit?: (arg: { message: Partial<ClientMessageData> }) => void;
  onCancel?: () => void;
  groupID: string | undefined;
  onFailSubmit?: (error: unknown) => void;
};

export type CommonMessageProps = StyleProps;

export type MessageProps = {
  /**
   * Contains the data of the message to be displayed.
   */
  message: ClientMessageData;
} & CommonMessageProps;

export interface CommonAvatarProps extends StyleProps {
  /**
   * Whether to enable tooltip on the avatar.
   */
  enableTooltip?: boolean;
  /**
   * Whether the user is absent.
   */
  isAbsent?: boolean;
}
export interface AvatarProps extends CommonAvatarProps {
  /**
   * Data of the user whose avatar is to be displayed.
   */
  user: ClientUserData;
}

export type AvatarTooltipProps = {
  viewerData: ViewerUserData;
  userData: ClientUserData;
};

export type AvatarFallbackProps = {
  userData: ClientUserData;
} & StyleProps;

export type PresenceObserverReactComponentProps = React.PropsWithChildren<{
  /**
   * When the user interacts with the DOM elements within the `<PresenceObserver>`,
   * they will be marked as present at this location in Cord's backend. This value
   * defaults to the current URL.
   */
  location: Location;
  /**
   * The [group](/rest-apis/groups) which should be able to see the user's presence.
   */
  groupID?: string;
  /**
   * When `true`, presence will be determined by whether or not the current document
   * is visible, rather than based on the "present" and "absent" DOM events.
   * Setting this to `true` means that `presentEvents`, `absentEvents`, and
   * `initialState` value will be ignored.
   *
   * The main situation in which you'd want to use this property is when other
   * events (like cursor and keyboard events) are not capturing user presence
   * accurately. A common case here is on very short pages where the majority
   * of the visible screen is an empty window. In these situations, you may
   * find that the user doesn't generate any mouse events since their cursor
   * isn't within the element.
   *
   * In the majority of such cases, you should consider using the `<PagePresence>`
   * component instead, because it provides both a `<PresenceObserver>` and a
   * `<PresenceFacepile>` in a single component.
   *
   * You may still want a `<PresenceObserver>` with `observeDocument` set to `true`
   * if you want to record presence on a page but not surface it. That is to say – you
   * want to observe presence, but you don't want to show a facepile. This is sometimes
   * the case when you want to record presence in one place but surface it in another place.
   *
   * The default is set to `false`.
   */
  observeDocument?: boolean;
  /**
   * When set to `true`, every user will be able to see the presence indicator for
   * any user (within the same group) who has ever been at this location at any
   * point in the past.
   *
   * When set to `false`, Cord will only show the users who are present at the same
   * location at the same time.
   *
   * The default is set to `false`.
   */
  durable?: boolean;
  /**
   * An array of event types that Cord should listen for to determine if the user
   * is present at the `location`.
   *
   * Cord marks presence and absence based on JavaScript events like `mouseenter`.
   * To do this, Cord uses a set of default event listeners that cover the majority
   * of cases. You may find that you need to set additional event listeners to
   * correctly capture a user's presence within your app.
   *
   * For each event type you list, Cord will automatically create an event listener
   * (by calling `addEventListener(<event type>, () => { ... })`). When these events
   * fire, Cord will pick up the event and mark the user as present in the
   * current location.
   *
   * Example: `['scroll', 'mousemove']`.
   *
   * The default is set to `['mouseenter', 'focusin']`.
   */
  presentEvents?: string[];
  /**
   * As with presentEvents, this value is an array of event types that Cord should
   * listen for to determine if the user has left the `location`.
   *
   * For each event type you list, Cord will automatically create an event listener
   * (by calling `addEventListener(<event type>, () => { ... })`). When these events
   * fire, Cord will pick up the event and mark the user as absent in the current location.
   *
   * Example: `['blur']`.
   *
   * The default is set to `['mouseleave', 'focusout']`.
   */
  absentEvents?: string[];
  /**
   * Callback invoked when presence state changes. This callback will receive a
   * `true` or `false` value as an argument indicating whether or not the user
   * is present at the `location`.
   */
  onChange?: (newValue: boolean) => unknown;
}>;

type CommonThreadProps = {
  showHeader?: boolean;
} & StyleProps;

export type ThreadByIDProps = {
  threadID: string;
  createThread?: ClientCreateThread;
} & CommonThreadProps;

export interface ThreadProps extends CommonThreadProps {
  threadData?: ClientThreadData;
}
