type UUID = string;
type UserID = string;

/**
 * `FlatJsonObject` is an object where all values are simple, scalar types
 * (string, number or boolean).
 */
export type FlatJsonObject = Record<string, string | number | boolean>;
export type EntityMetadata = FlatJsonObject;
export type Location = FlatJsonObject;

// For backwards compatibility, will be removed along with the deprecated context prop
export type Context = Location;

// Fast comparison of two Locations
export function isEqualLocation(
  a: Location | undefined,
  b: Location | undefined,
) {
  // If `a` and `b` are the same object (or both are undefined) -> true
  if (a === b) {
    return true;
  }
  // If either `a` or `b` is undefined -> false
  // (If they are both undefined, we returned true above.)
  if (!a || !b) {
    return false;
  }

  // Get all keys of `a` and check that `b` has the same number of keys.
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }

  // If `b` does not have all the keys of `a` -> false
  if (!aKeys.every((aKey) => Object.prototype.hasOwnProperty.call(b, aKey))) {
    return false;
  }

  // We know that `a` and `b` have identical keys. Return whether the values are
  // identical, too.
  return aKeys.every((key) => a[key] === b[key]);
}

// navigate, if present and returning true, overrides our default navigate behaviour
export type NavigateFn = (
  url: string,
  location: Location | null,
  identity: { orgID: string },
) => boolean | Promise<boolean>;

export type CordSDKOptions = {
  /**
   * @deprecated The session_token prop has been renamed to client_auth_token.
   */
  session_token?: string;
  client_auth_token?: string;
  navigate?: NavigateFn | null;
  enable_tasks?: boolean;
  enable_annotations?: boolean;
  blur_screenshots?: boolean;
  enable_screenshot_capture?: boolean;
  show_blurred_screenshots?: BlurDisplayLocation;
  /**
   * @deprecated The annotation_mode prop has been superseded by enable_annotations
   */
  annotation_mode?: AnnotationMode;
  react_package_version?: string;
  thread_options?: ThreadOptions;
  onInitError?: InitErrorCallback;
};

export type InitErrorCallback = (error: { message: string }) => unknown;

export type LoadCallback = (sdk: ICordSDK) => unknown;

export type AnnotationCapturePosition = {
  x: number;
  y: number;
  element: HTMLElement;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnnotationCaptureResult<L extends Location = {}> = {
  extraLocation?: Partial<L>;
  label?: string;
};

export type AnnotationRenderPosition = {
  coordinates?: {
    x: number | string;
    y: number | string;
  };
  element?: HTMLElement;
};

export type Annotation<L extends Location = Location> = {
  id: string;
  location: L;
};

export type AnnotationPositionRendererCallback<L extends Location = Location> =
  (
    annotation: Annotation<L>,
    coordsRelativeToTarget: { x: number; y: number },
  ) => AnnotationRenderPosition | null | undefined | void;

export type AnnotationHandler<L extends Location = Location> = {
  getAnnotationPosition: AnnotationPositionRendererCallback<L>;
  onAnnotationCapture: (
    capturePosition: AnnotationCapturePosition,
    element: HTMLElement,
  ) => AnnotationCaptureResult | undefined | void;
  onAnnotationClick: (annotation: Annotation<L>) => unknown;
};

export interface ICordAnnotationSDK {
  /**
   * @deprecated Use functions specific to the type of handler you are setting.
   */
  setAnnotationHandler<T extends keyof AnnotationHandler, L extends Location>(
    type: T,
    locationString: string,
    handler: AnnotationHandler<L>[T] | null,
  ): void;

  setRenderHandler<L extends Location>(
    location: L,
    handler: AnnotationHandler<L>['getAnnotationPosition'],
  ): void;
  clearRenderHandler(location: Location): void;

  setCaptureHandler<L extends Location>(
    location: L,
    handler: AnnotationHandler<L>['onAnnotationCapture'],
  ): void;
  clearCaptureHandler(location: Location): void;

  setClickHandler<L extends Location>(
    location: L,
    handler: AnnotationHandler<L>['onAnnotationClick'],
  ): void;
  clearClickHandler(location: Location): void;

  redrawAnnotations(): void;
}

export type GetPresentOptions = {
  exclude_durable?: boolean;
  partial_match?: boolean;
};

export type SetPresentOptions = {
  durable?: boolean;
  absent?: boolean;
  exclusive_within?: Location;
};

export type AddListenerOptions = {
  partial_match?: boolean;
};

export type PresenceListener = (update: UserLocationData) => void;

export type ObservePresenceOptions = {
  exclude_durable?: boolean;
  partial_match?: boolean;
};

export type UserLocationData = {
  id: string;
  ephemeral?: {
    locations: Location[] | null;
  };
  durable?: {
    location: Location;
    timestamp: Date;
  };
};

export type UserPresenceInformation = {
  present: boolean;
  lastPresent: Date;
  presentLocations: Location[];
};

export type ListenerRef = number;

export type PresenceUpdateCallback = (present: UserLocationData[]) => unknown;

export interface ICordPresenceSDK {
  setPresent(location: Location, options?: SetPresentOptions): void;
  getPresent(
    matcher: Location,
    options?: GetPresentOptions,
  ): Promise<UserLocationData[]>;

  addListener(
    listener: PresenceListener,
    matcher: Location,
    options?: AddListenerOptions,
  ): ListenerRef;
  removeListener(index: ListenerRef): boolean;

  observeLocationData(
    matcher: Location,
    callback: PresenceUpdateCallback,
    options?: ObservePresenceOptions,
  ): ListenerRef;
  unobserveLocationData(ref: ListenerRef): boolean;
}

export type UserUpdateListener = (user: User) => unknown;

export interface ICordUserSDK {
  getViewerID(): Promise<string>;
  addUserListener(id: string, listener: UserUpdateListener): ListenerRef;
  removeUserListener(ref: ListenerRef): void;
}

export type ObserveThreadActivitySummaryOptions = {
  partialMatch?: boolean;
};

export type ObserveThreadActivitySummaryHookOptions = {
  partialMatch?: boolean;
};

export type ThreadActivitySummary = {
  total: number;
  unread: number;
  unreadSubscribed: number;
  resolved: number;
};

export type ThreadActivitySummaryUpdateCallback = (
  summary: ThreadActivitySummary,
) => unknown;

export interface ICordActivitySDK {
  observeThreadSummary(
    location: Location,
    callback: ThreadActivitySummaryUpdateCallback,
    options?: ObserveThreadActivitySummaryOptions,
  ): ListenerRef;
  unobserveThreadSummary(ref: ListenerRef): boolean;
}

export type FetchMoreCallback = (howMany: number) => Promise<void>;
export type PaginationParams = {
  loading: boolean;
  fetchMore: FetchMoreCallback;
  hasMore: boolean;
};

export type ThreadParticipant = {
  lastSeenTimestamp: Date | null;
  userID: UserID | null;
};

export type ThreadSummary = {
  id: string;
  total: number;
  unread: number;
  resolved: boolean;
  participants: ThreadParticipant[];
  typing: UserID[];
  viewerIsThreadParticipant: boolean;
  location: Location;
};
export type ThreadSummaryUpdateCallback = (summary: ThreadSummary) => unknown;

type ThreadObserverOptions = {
  threadName?: string;
  location?: Location;
};

export type ObserveThreadSummaryOptions = ThreadObserverOptions;
export type ObserveThreadDataOptions = ThreadObserverOptions;

export type ThreadIDs = PaginationParams & {
  ids: string[];
};
export type ThreadIDsCallback = (ids: ThreadIDs) => unknown;

export interface ICordThreadSDK {
  observeThreadSummary(
    threadId: string,
    callback: ThreadSummaryUpdateCallback,
    options?: ObserveThreadSummaryOptions,
  ): ListenerRef;
  unobserveThreadSummary(ref: ListenerRef): boolean;
}

export interface ICordDumpingGroundSDK {
  observeThreadIDs(
    location: Location,
    callback: ThreadIDsCallback,
  ): ListenerRef;
  unobserveThreadIDs(ref: ListenerRef): boolean;
}

export type MessageSummary = {
  id: string;
  timestamp: Date;
  seen: boolean;
};

export type ThreadData = PaginationParams & {
  oldestMessage: MessageSummary | undefined;
  messages: MessageSummary[];
};
export type ThreadDataCallback = (data: ThreadData) => unknown;

export interface ICordMessagesSDK {
  observeThreadData(
    threadId: string,
    callback: ThreadDataCallback,
    options?: ObserveThreadDataOptions,
  ): ListenerRef;
  unobserveThreadData(ref: ListenerRef): boolean;
}

export type NotificationSummary = {
  unread: number;
};

export type NotificationSummaryUpdateCallback = (
  summary: NotificationSummary,
) => unknown;

export interface ICordNotificationSDK {
  observeNotificationSummary(
    callback: NotificationSummaryUpdateCallback,
    options?: Record<never, string>,
  ): ListenerRef;
  unobserveNotificationSummary(ref: ListenerRef): boolean;
}

export interface ICordSDK {
  init(options: CordSDKOptions): Promise<void>;
  destroy(): void;
  addMonacoEditor(id: string, monacoEditor: unknown): void;
  removeMonacoEditor(id: string): void;
  addReactTree(id: string, reactTree: unknown): void;
  removeReactTree(id: string): void;
  annotation: ICordAnnotationSDK;
  /** @deprecated Renamed to sdk.annotation. */
  annotations: ICordAnnotationSDK;
  presence: ICordPresenceSDK;
  user: ICordUserSDK;
  activity: ICordActivitySDK;
  thread: ICordThreadSDK;
  notification: ICordNotificationSDK;
  experimental: {
    dumpingGround: ICordDumpingGroundSDK;
    messages: ICordMessagesSDK;
  };
}

declare global {
  interface Window {
    CordSDK?: ICordSDK;
  }
}

/* cord-multiple-cursors */

export type MultipleCursorsWebComponentEvents = Record<string, never>;

/* cord-page-presence */

export type PagePresenceWebComponentEvents = {
  update: [foo: number];
};

/* cord-presence-facepile */

export type PresenceFacepileWebComponentEvents = {
  update: [foo: number];
};

export type Orientation = 'horizontal' | 'vertical';

/* cord-presence-observer */

export type PresenceObserverWebComponentEvents = {
  change: [present: boolean];
};

/* cord-sidebar */

export type SidebarWebComponentEvents = {
  open: [{ width?: number }];
  close: [];
  threadopen: [threadID: string];
  threadclose: [threadID: string];
};

/* cord-sidebar-launcher */

export type SidebarLauncherWebComponentEvents = {
  click: [];
};

export type BadgeStyle = 'badge' | 'badge_with_count' | 'none';

/* cord-floating-threads */

export type FloatingThreadsWebComponentEvents = {
  start: [];
  finish: [];
  cancel: [];
};

/* cord-thread */
export type ThreadWebComponentEvents = {
  threadinfochange: [threadInfo: ThreadInfo];
  close: [];
  resolved: [];
  render: [];
  loading: [];
};

export type ThreadInfo = {
  messageCount: number;
};

/* cord-thread-list */
export type ThreadListWebComponentEvents = {
  threadclick: [threadID: string, threadSummary: ThreadSummary];
  threadmouseenter: [threadID: string];
  threadmouseleave: [threadID: string];
  threadresolve: [{ threadID: string }];
  threadreopen: [{ threadID: string }];
  render: [];
  loading: [];
};

/* cord-composer */
export type ComposerWebComponentEvents = {
  focus: [{ threadId: string }];
  blur: [{ threadId: string }];
};

/* cord-inbox-launcher */
export type InboxLauncherWebComponentEvents = { click: [] };

/* cord-inbox */
export type InboxWebComponentEvents = { closeRequested: [] };

// cord-notification-list-launcher
export type NotificationListLauncherWebComponentEvents = { click: [] };

// cord-pin
export type PinWebComponentEvents = {
  resolve: [];
  click: [];
  mouseEnter: [];
  mouseLeave: [];
};

/* annotation types */

export type DocumentAnnotationResult = {
  annotation: MessageAnnotation;
  screenshot: Screenshot;
  blurredScreenshot: Screenshot;
};

export interface MessageAnnotation {
  id: string;
  location: DocumentLocation | null;
  customLocation: Location | null;
  customHighlightedTextConfig: HighlightedTextConfig | null;
  customLabel: string | null;
  coordsRelativeToTarget: { x: number; y: number } | null;
  sourceID: UUID;
  draft?: boolean;
}

export type DocumentLocation = {
  selector: string;
  x: number;
  y: number;
  iframeSelectors: string[];
  onChart: boolean | null;
  textConfig: LocationTextConfig | null;
  elementIdentifier: {
    version: ElementIdentifierVersion;
    identifier: JsonObject;
  } | null;
  highlightedTextConfig: HighlightedTextConfig | null;
  multimediaConfig: MultimediaConfig | null;
  // In some cases, we need to record more data to be able
  // to provide some functionality.
  additionalTargetData: AdditionalTargetData | null;
};

export type LocationTextConfig = {
  selectedCharOffset: number;
  textToMatch: string;
  textToMatchOffset: number;
  nodeIndex: number;
  xVsPointer: number;
  yVsPointer: number;
};

export type ElementIdentifierVersion = '1' | '2';

export type HighlightedTextConfig = {
  startElementSelector: string;
  endElementSelector: string;
  startNodeIndex: number;
  startNodeOffset: number;
  endNodeIndex: number;
  endNodeOffset: number;
  selectedText: string;
  // We added textToDisplay while developing this feature, so some annotations
  // won't have it. Later, we should be able to make it required and correct any
  // old annotations (by setting textToDisplay equal to selectedText)
  textToDisplay: string | null;
};

type MultimediaConfig = {
  currentTime: number;
};

export const VIRTUALISED_LISTS = [
  'monacoEditor',
  'reactTree',
  'konvaCanvas',
] as const;
export type TargetType = (typeof VIRTUALISED_LISTS)[number];

export type AdditionalTargetData = {
  targetType: TargetType;
  monacoEditor: {
    monacoID: string | null;
    lineNumber: number;
  } | null;
  reactTree: {
    key: string;
    treeID: string | null;
  } | null;
  konvaCanvas: {
    x: number;
    y: number;
  } | null;
};

type FileUploadStatus = 'uploaded' | 'uploading' | 'failed' | 'cancelled';
export type Screenshot = null | {
  id: UUID;
  name: string;
  mimeType: string;
  url: string;
  uploadStatus: FileUploadStatus;
  size: number;
};

/* utility types */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | JsonObject;

export type JsonObject = { [key: string]: JsonValue | undefined };

const BLUR_DISPLAY_LOCATIONS = ['everywhere', 'outside_page'] as const;

export type BlurDisplayLocation = (typeof BLUR_DISPLAY_LOCATIONS)[number];

export function isBlurDisplayLocation(
  behavior: string,
): behavior is BlurDisplayLocation {
  return (BLUR_DISPLAY_LOCATIONS as readonly string[]).indexOf(behavior) !== -1;
}

const ANNOTATION_MODES = ['everywhere', 'custom_targets_only', 'none'] as const;

export type AnnotationMode = (typeof ANNOTATION_MODES)[number];

export function isAnnotationMode(mode: string): mode is AnnotationMode {
  return (ANNOTATION_MODES as readonly string[]).indexOf(mode) !== -1;
}

// declare global {
//   interface Element {
//     addEventListener<K extends keyof CordCustomEvents>(
//       type: K,
//       listener: (this: Document, event: CordCustomEvents[K]) => void,
//     ): void;
//   }
// }

// type FT = Parameters<typeof f>;

// type CustomEvents<T extends Record<string, Function>> = {
//   [P in keyof T]: Parameters<T[P]>;
// };

// type TextComponentCustomEvents = CustomEvents<TextComponentEvents>;

export const CORD_ANNOTATION_LOCATION_DATA_ATTRIBUTE =
  'data-cord-annotation-location';

export const CORD_ANNOTATION_ALLOWED_DATA_ATTRIBUTE =
  'data-cord-annotation-allowed';

export const CORD_COMPONENT_WRAPS_DOM_DATA_ATTRIBUTE =
  'data-cord-component-wraps-dom';

export const CORD_SCREENSHOT_TARGET_DATA_ATTRIBUTE =
  'data-cord-screenshot-target';

export function locationJson(c: Partial<Location>): string {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(c)
        .filter(([_key, value]) => value !== undefined)
        .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : 1)),
    ),
  );
}

export type User = {
  id: string;
  name: string | null;
  profilePictureURL: string | null;
};

export interface HTMLCordElement extends HTMLElement {
  initialised?: true;
}

export interface HTMLCordSidebarFunctions {
  startComposer(): void;
}

export interface HTMLCordSidebarElement
  extends HTMLCordElement,
    HTMLCordSidebarFunctions,
    WithScreenshotConfig {}

export interface HTMLCordFloatingThreadsFunctions {
  openThread(threadId: string): void;
  createThread(): void;
  cancelThread(): void;
}

export interface HTMLCordFloatingThreadsElement
  extends HTMLCordElement,
    HTMLCordFloatingThreadsFunctions {}

export type HTMLCordAnchoredThreadsElement = HTMLCordFloatingThreadsElement;

export type ThreadOptions = {
  additional_subscribers_on_create: string[];
};

export type HTMLCordThreadElement = WithScreenshotConfig;

/**
 * Specify what DOM element to screenshot. This overrides Cord's
 * default screenshot behaviour, which is to take a screenshot of
 * the current viewport.
 *
 * You can set this to `undefined` to enable Cord's default behaviour again.
 */
export type ScreenshotConfig =
  | {
      /**
       * The screenshot will only include this DOM
       * element and all of its children.
       */
      targetElement: HTMLElement;
      /**
       * Crop the screenshot to a specific rectangle within the target element. All values must be specified in pixels.
       */
      cropRectangle?: Partial<{
        /** X coordinate of the top left corner of the rectangle. By default, this matches the top left corner of the `targetElement` */
        x: number;
        /** Y coordinate of the top left corner of the rectangle. By default, this matches the top left corner of the `targetElement` */
        y: number;
        /** By default, this is the width of the `targetElement` */
        width: number;
        /** By default, this is the height of the `targetElement` */
        height: number;
      }>;
    }
  | undefined;

export interface WithScreenshotConfig extends HTMLCordElement {
  screenshotConfig: ScreenshotConfig;
}

export type ThreadListFilter = { metadata: EntityMetadata };
