export type UUID = string;
export type UserID = string;
export type MessageID = string;

/**
 * `FlatJsonObject` is an object where all values are simple, scalar types
 * (string, number or boolean).
 */
export type FlatJsonObject = { [key: string]: string | number | boolean };
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

export type ScreenshotOptions = {
  blur?: boolean;
  show_blurred?: BlurDisplayLocation;
  capture_when?: CaptureScreenshotEvent[];
  show_screenshot?: boolean;
};

export type CordSDKOptions = {
  /**
   * @deprecated The session_token prop has been renamed to client_auth_token.
   */
  session_token?: string;
  client_auth_token?: string;
  navigate?: NavigateFn | null;
  enable_tasks?: boolean;
  enable_annotations?: boolean;
  /** @deprecated use `screenshot_options.blur` instead */
  blur_screenshots?: boolean;
  /** @deprecated use `screenshot_options.capture` instead */
  enable_screenshot_capture?: boolean;
  /** @deprecated use `screenshot_options.showBlurred` instead */
  show_blurred_screenshots?: BlurDisplayLocation;
  /**
   * @deprecated The annotation_mode prop has been superseded by enable_annotations
   */
  annotation_mode?: AnnotationMode;
  react_package_version?: string;
  thread_options?: ThreadOptions;
  screenshot_options?: ScreenshotOptions;
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

export type AnnotationWithThreadID<L extends Location = Location> = {
  id: string;
  location: L;
  threadID: string;
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
  onAnnotationClick: (annotation: AnnotationWithThreadID<L>) => unknown;
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

export interface AddListenerOptions {
  partial_match?: boolean;
}

export type PresenceListener = (update: PartialUserLocationData) => void;

export type ObservePresenceOptions = {
  exclude_durable?: boolean;
  partial_match?: boolean;
};

export type PartialUserLocationData = {
  id: string;
  ephemeral?: {
    locations: Location[] | null;
  };
  durable?: {
    location: Location;
    timestamp: Date;
  };
};

export type UserLocationData = PartialUserLocationData & {
  ephemeral: {
    locations: Location[];
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
  ): Promise<PartialUserLocationData[]>;

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

export type SingleUserUpdateCallback = (user: UserData | null) => unknown;
export type MultipleUserUpdateCallback = (
  users: Record<string, UserData | null>,
) => unknown;
export type ViewerUserUpdateCallback = (user: ViewerUserData) => unknown;

export interface ICordUserSDK {
  observeUserData(
    userID: string,
    callback: SingleUserUpdateCallback,
  ): ListenerRef;
  observeUserData(
    userIDs: Array<string>,
    callback: MultipleUserUpdateCallback,
  ): ListenerRef;
  unobserveUserData(ref: ListenerRef): boolean;

  observeViewerData(callback: ViewerUserUpdateCallback): ListenerRef;
  unobserveViewerData(ref: ListenerRef): boolean;
}

/**
 * Options for the `observeLocationSummary` function in the Thread API.
 */
export interface ObserveThreadActivitySummaryOptions {
  /**
   * If `true`, perform [partial
   * matching](https://docs.cord.com/reference/location#Partial-Matching) on the
   * specified location. If `false`, fetch information for only exactly the
   * location specified.
   *
   * If unset, defaults to `false`.
   */
  partialMatch?: boolean;
}

export type ObserveThreadActivitySummaryHookOptions = {
  partialMatch?: boolean;
};

/**
 * A summary of the activity within a single thread.
 */
export interface ThreadActivitySummary {
  /**
   * The total number of threads at the
   * [location](https://docs.cord.com/reference/location), both resolved and
   * unresolved.
   */
  total: number;
  /**
   * The total number of threads that have messages the current user hasn't seen
   * yet.
   *
   * This will count all threads with unread messages at the location, whether
   * the current user is subscribed to the thread or not.
   */
  unread: number;
  /**
   * The number of threads that have messages the current user hasn't seen yet
   * and is subscribed to.
   *
   * A user is automatically subscribed to threads relevant to them, for example
   * because they have sent a message or have been \@-mentioned in them.
   * `unreadSubscribed` is always less than or equal to `unread`.
   */
  unreadSubscribed: number;
  /**
   * The number of resolved threads. This refers to threads that users have
   * manually marked as resolved within Cord's UI components.
   */
  resolved: number;
}

export type ThreadActivitySummaryUpdateCallback = (
  summary: ThreadActivitySummary,
) => unknown;

/**
 * @deprecated All functions in this interface have been renamed.
 */
export interface ICordActivitySDK {
  /**
   * @deprecated Renamed to sdk.thread.observeLocationSummary.
   */
  observeThreadSummary(
    ...args: Parameters<ICordThreadSDK['observeLocationSummary']>
  ): ReturnType<ICordThreadSDK['observeLocationSummary']>;

  /**
   * @deprecated Renamed to sdk.thread.unobserveLocationSummary.
   */
  unobserveThreadSummary(
    ...args: Parameters<ICordThreadSDK['unobserveLocationSummary']>
  ): ReturnType<ICordThreadSDK['unobserveLocationSummary']>;
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

// This is split out for the benefit of api-types.
export type ThreadVariables = {
  id: string;
  organizationID: string;
  total: number;
  resolved: boolean;
  resolvedTimestamp: Date | null;
  participants: ThreadParticipant[];
  name: string;
  location: Location;
};

export type ThreadSummary = Omit<ThreadVariables, 'resolvedTimestamp'> & {
  unread: number;
  typing: UserID[];
  viewerIsThreadParticipant: boolean;
  firstMessage: MessageSummary | null;
};
export type ThreadSummaryUpdateCallback = (summary: ThreadSummary) => unknown;

export type ThreadObserverOptions = {
  threadName?: string;
  location?: Location;
};

export type ObserveThreadSummaryOptions = ThreadObserverOptions;
export type ObserveThreadDataOptions = ThreadObserverOptions;

export type SortDirection = 'ascending' | 'descending';
export type SortBy =
  | 'first_message_timestamp'
  | 'most_recent_message_timestamp';
export type ObserveLocationDataOptions = {
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  includeResolved?: boolean;
};

export type LocationData = PaginationParams & {
  threads: ThreadSummary[];
};
export type LocationDataCallback = (data: LocationData) => unknown;

export interface ICordThreadSDK {
  /**
   * This method allows you to observe summary information about a
   * [location](https://docs.cord.com/reference/location), including live
   * updates.
   * @example Overview
   * ```javascript
   * const ref = window.CordSDK.thread.observeLocationSummary(location, callback, options);
   * window.CordSDK.thread.unobserveLocationSummary(ref);
   * ```
   * @example Usage
   * ```javascript
   * const ref = window.CordSDK.thread.observeLocationSummary(
   *   {page: 'document_details'},
   *   (summary) => {
   *      // Received an update!
   *      console.log("Total threads", summary.total);
   *      console.log("Unread threads", summary.unread);
   *      console.log("Unread subscribed threads", summary.unreadSubscribed);
   *      console.log("Resolved threads", summary.resolved);
   *   },
   *   {partialMatch: true}
   * );
   * // ... Later, when updates are no longer needed ...
   * window.CordSDK.thread.unobserveLocationSummary(ref);
   * ```
   * @param location - The [location](https://docs.cord.com/reference/location) to
   * fetch summary information for.
   * @param callback - This callback will be called once with the current location
   * summary, and then again every time the data changes. The argument passed to
   * the callback is an object which will contain the fields described under
   * "Available Data" above.
   * @param options - Miscellaneous options. See below.
   */
  observeLocationSummary(
    location: Location,
    callback: ThreadActivitySummaryUpdateCallback,
    options?: ObserveThreadActivitySummaryOptions,
  ): ListenerRef;
  unobserveLocationSummary(ref: ListenerRef): boolean;

  observeLocationData(
    location: Location,
    callback: LocationDataCallback,
    options?: ObserveLocationDataOptions,
  ): ListenerRef;
  unobserveLocationData(ref: ListenerRef): boolean;

  observeThreadSummary(
    threadId: string,
    callback: ThreadSummaryUpdateCallback,
    options?: ObserveThreadSummaryOptions,
  ): ListenerRef;
  unobserveThreadSummary(ref: ListenerRef): boolean;

  observeThreadData(
    threadId: string,
    callback: ThreadDataCallback,
    options?: ObserveThreadDataOptions,
  ): ListenerRef;
  unobserveThreadData(ref: ListenerRef): boolean;
}

export type MessageSummary = {
  id: MessageID;
  createdTimestamp: Date;
  deletedTimestamp: Date | null;
  seen: boolean;
};

export type ThreadData = PaginationParams & {
  firstMessage: MessageSummary | null;
  messages: MessageSummary[];
};
export type ThreadDataCallback = (data: ThreadData) => unknown;

export type NotificationSummary = {
  unread: number;
};

export type NotificationSummaryUpdateCallback = (
  summary: NotificationSummary,
) => unknown;

export interface ICordNotificationSDK {
  observeSummary(
    callback: NotificationSummaryUpdateCallback,
    options?: Record<never, string>,
  ): ListenerRef;
  unobserveSummary(ref: ListenerRef): boolean;

  /**
   * @deprecated Renamed to observeSummary.
   */
  observeNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['observeSummary']>
  ): ReturnType<ICordNotificationSDK['observeSummary']>;

  /**
   * @deprecated Renamed to unobserveSummary.
   */
  unobserveNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['unobserveSummary']>
  ): ReturnType<ICordNotificationSDK['unobserveSummary']>;
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
  /** @deprecated All functions under sdk.activity have been renamed. */
  activity: ICordActivitySDK;
  thread: ICordThreadSDK;
  notification: ICordNotificationSDK;
  experimental: Record<string, never>;
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
  close: [{ threadId: string }];
};

export const COMPOSER_SIZE = ['small', 'medium', 'large'] as const;
export type ComposerSize = (typeof COMPOSER_SIZE)[number];

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

export type MultimediaConfig = {
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

export type FileUploadStatus =
  | 'uploaded'
  | 'uploading'
  | 'failed'
  | 'cancelled';
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

export const BLUR_DISPLAY_LOCATIONS = ['everywhere', 'outside_page'] as const;
export type BlurDisplayLocation = (typeof BLUR_DISPLAY_LOCATIONS)[number];

export const CAPTURE_SCREENSHOT_EVENT = [
  'new-annotation',
  'share-via-email',
  'new-thread',
  'new-message',
] as const;
export type CaptureScreenshotEvent = (typeof CAPTURE_SCREENSHOT_EVENT)[number];
export function isCaptureScreenshotEvent(
  captureEvent: string,
): captureEvent is CaptureScreenshotEvent {
  return (
    (CAPTURE_SCREENSHOT_EVENT as readonly string[]).indexOf(captureEvent) !== -1
  );
}

export function isBlurDisplayLocation(
  behavior: string,
): behavior is BlurDisplayLocation {
  return (BLUR_DISPLAY_LOCATIONS as readonly string[]).indexOf(behavior) !== -1;
}

export const ANNOTATION_MODES = [
  'everywhere',
  'custom_targets_only',
  'none',
] as const;

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

export type UserData = {
  id: string;
  name: string | null;
  shortName: string | null;
  profilePictureURL: string | null;
  metadata: EntityMetadata;
};

export type ViewerUserData = UserData & {
  organizationID: string;
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
    HTMLCordFloatingThreadsFunctions,
    WithScreenshotConfig {}

export interface HTMLCordMultipleCursorsFunctions {
  setTranslations(
    eventToLocation: (e: MouseEvent) => Location,
    locationToDocument: (location: Location) =>
      | {
          documentX: number;
          documentY: number;
        }
      | null
      | undefined,
  ): void;
}

export interface HTMLCordMultipleCursorsElement
  extends HTMLCordElement,
    HTMLCordMultipleCursorsFunctions {}

export type HTMLCordAnchoredThreadsElement = HTMLCordFloatingThreadsElement;

export type ThreadOptions = {
  additional_subscribers_on_create: string[];
};

export type HTMLCordThreadElement = WithScreenshotConfig;

/**
 * Specify what DOM element to screenshot. This overrides Cord's
 * default screenshot behaviour, which is to take a screenshot of
 * the current viewport.
 * Alternatively, you can provide Cord with your own screenshot,
 * using `screenshotUrlOverride`.
 *
 * You can set the `ScreenshotConfig` to `undefined` to re-enable Cord's
 * default behaviour.
 */
export type ScreenshotConfig =
  | {
      /**
       * The screenshot will only include this DOM
       * element and all of its children. Unless a screenshotUrlOverride is provided,
       * in which case the screenshot will be the image available at that URL.
       */
      targetElement?: HTMLElement;
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
      /**
       * If specified, Cord will NOT take a screenshot and use the image at this URL instead.
       */
      screenshotUrlOverride?: string;
    }
  | undefined;

export interface WithScreenshotConfig extends HTMLCordElement {
  screenshotConfig: ScreenshotConfig;
}

export type ThreadListFilter = { metadata: EntityMetadata };
export type NotificationListFilter = { metadata: EntityMetadata };
