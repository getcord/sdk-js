type UUID = string;

export type Location = Record<string, string | number | boolean>;

// For backwards compatibility, will be removed along with the deprecated context prop
export type Context = Location;

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
  exact_match?: boolean;
};

export type SetPresentOptions = {
  durable?: boolean;
  absent?: boolean;
  exclusive_within?: Location;
};

export type AddListenerOptions = {
  exact_match?: boolean;
};

export type PresenceListener = (update: UserLocationData) => void;

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
  removeListener(index: ListenerRef): void;
}

export type UserUpdateListener = (user: User) => unknown;

export interface ICordUsersSDK {
  getViewerID(): Promise<string>;
  addUserListener(id: string, listener: UserUpdateListener): ListenerRef;
  removeUserListener(ref: ListenerRef): void;
}

export type ThreadsActivitySummary = {
  total: number;
  unread: number;
  resolved: number;
};

export type ThreadsActivitySummaryUpdateCallback = (
  summary: ThreadsActivitySummary,
) => unknown;

export interface ICordActivitySDK {
  observeThreadsSummary(
    location: Location,
    callback: ThreadsActivitySummaryUpdateCallback,
  ): ListenerRef;
  unobserveThreadsSummary(ref: ListenerRef): boolean;
}

export interface ICordSDK {
  init(options: CordSDKOptions): Promise<void>;
  destroy(): void;
  addMonacoEditor(id: string, monacoEditor: unknown): void;
  removeMonacoEditor(id: string): void;
  addReactTree(id: string, reactTree: unknown): void;
  removeReactTree(id: string): void;
  annotations: ICordAnnotationSDK;
  presence: ICordPresenceSDK;
  users: ICordUsersSDK;
  activity: ICordActivitySDK;
}

declare global {
  interface Window {
    CordSDK?: ICordSDK;
  }
}

/* cord-text */

export type TextWebComponentEvents = {
  boop: [boop: string];
};

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
};

/* cord-sidebar-launcher */

export type SidebarLauncherWebComponentEvents = {
  click: [];
};

export type BadgeStyle = 'badge' | 'badge_with_count' | 'none';

/* cord-collaboration */

export type CollaborationWebComponentEvents = Record<string, never>;

/* cord-floating-threads */

export type FloatingThreadsWebComponentEvents = Record<string, never>;

/* cord-thread */

export type ThreadWebComponentEvents = {
  threadinfochange: [threadInfo: ThreadInfo];
  close: [];
  resolved: [];
};

export type ThreadInfo = {
  messageCount: number;
};

/* cord-thread-list */
export type ThreadListWebComponentEvents = {
  threadclick: [threadID: string];
};

/* cord-inbox-launcher */
export type InboxLauncherWebComponentEvents = { click: [] };

/* cord-inbox */
export type InboxWebComponentEvents = { closeRequested: [] };

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
export type TargetType = typeof VIRTUALISED_LISTS[number];

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

export type ComponentPropConverter<
  ReactComponentProps,
  WebComponentAttributes extends string,
> = (
  props: ReactComponentProps,
) => Record<WebComponentAttributes, string | undefined>;

export type ComponentAttributeConverter<
  WebComponentAttributes extends string,
  ReactComponentProps,
> = Record<
  WebComponentAttributes,
  {
    [P in keyof ReactComponentProps]: (
      value: string | null,
    ) => ReactComponentProps[P];
  }
>;

export type PropsWithStandardHTMLAttributes<T> = T & {
  id?: string;
  className?: string;
  // TODO: maybe allow style here? what would that even mean?
};

const BLUR_DISPLAY_LOCATIONS = ['everywhere', 'outside_page'] as const;

export type BlurDisplayLocation = typeof BLUR_DISPLAY_LOCATIONS[number];

export function isBlurDisplayLocation(
  behavior: string,
): behavior is BlurDisplayLocation {
  return (BLUR_DISPLAY_LOCATIONS as readonly string[]).indexOf(behavior) !== -1;
}

const ANNOTATION_MODES = ['everywhere', 'custom_targets_only', 'none'] as const;

export type AnnotationMode = typeof ANNOTATION_MODES[number];

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

export interface HTMLCordSidebarElement extends HTMLCordElement {
  startComposer(): void;
}

export interface HTMLCordFloatingThreadsElement extends HTMLCordElement {
  openThread(threadId: string): void;
  createThread(): void;
}

export type HTMLCordAnchoredThreadsElement = HTMLCordFloatingThreadsElement;

export type ThreadOptions = {
  additional_subscribers_on_create: string[];
};
