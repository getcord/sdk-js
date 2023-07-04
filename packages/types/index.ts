import type {
  EntityMetadata,
  Location,
  OrganizationID,
  ThreadID,
  UUID,
} from './core';
import type { ICordNotificationSDK } from './notifications';
import type { ICordPresenceSDK } from './presence';
import type { ICordActivitySDK, ICordThreadSDK, ThreadSummary } from './thread';
import type { ICordUserSDK } from './user';

export * from './core';
export * from './message';
export * from './notifications';
export * from './presence';
export * from './thread';
export * from './user';

// navigate, if present and returning true, overrides our default navigate behavior
export type NavigateFn = (
  url: string,
  location: Location | null,
  info: { orgID: OrganizationID; threadID: ThreadID },
) => boolean | Promise<boolean>;

export type ScreenshotOptions = {
  blur?: boolean;
  show_blurred?: BlurDisplayLocation;
  capture_when?: CaptureScreenshotEvent[];
  show_screenshot?: boolean;
};

export type CustomRenderers = Record<
  string,
  (m: Record<string, unknown>) => HTMLElement
>;

export type CordSDKOptions = {
  /**
   * @deprecated The session_token prop has been renamed to client_auth_token
   */
  session_token?: string;
  client_auth_token?: string;
  navigate?: NavigateFn | null;
  enable_tasks?: boolean;
  enable_annotations?: boolean;
  enable_slack?: boolean;
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
  custom_renderers?: CustomRenderers;
  onInitError?: InitErrorCallback;
  custom_event_metadata?: JsonObject;
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
  threadID: ThreadID;
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
  threadopen: [threadID: ThreadID];
  threadclose: [threadID: ThreadID];
};

/* cord-sidebar-launcher */

export type SidebarLauncherWebComponentEvents = {
  click: [];
};

/**
 * @deprecated Use CSS instead: target `.cord-badge` class
 * and apply any styles.
 */
export type BadgeStyle = 'badge' | 'badge_with_count' | 'none';

/* cord-floating-threads */

export type FloatingThreadsWebComponentEvents = {
  start: [];
  finish: [threadID: ThreadID];
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
  threadclick: [threadID: ThreadID, threadSummary: ThreadSummary];
  threadmouseenter: [threadID: ThreadID];
  threadmouseleave: [threadID: ThreadID];
  threadresolve: [{ threadID: ThreadID }];
  threadreopen: [{ threadID: ThreadID }];
  render: [];
  loading: [];
};

/* cord-composer */
export type ComposerWebComponentEvents = {
  focus: [{ threadId: ThreadID }];
  blur: [{ threadId: ThreadID }];
  close: [{ threadId: ThreadID }];
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
  resolve: [ThreadSummary | null];
  click: [ThreadSummary | null];
  mouseenter: [ThreadSummary | null];
  mouseleave: [ThreadSummary | null];
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

export interface HTMLCordElement extends HTMLElement {
  initialised?: true;
  dispatchCordEvent(e: Event): void;
}

export interface HTMLCordSidebarFunctions {
  startComposer(): void;
}

export interface HTMLCordSidebarElement
  extends HTMLCordElement,
    HTMLCordSidebarFunctions,
    WithScreenshotConfig {}

export interface HTMLCordFloatingThreadsFunctions {
  openThread(threadId: ThreadID): void;
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
 * default screenshot behavior, which is to take a screenshot of
 * the current viewport.
 * Alternatively, you can provide Cord with your own screenshot,
 * using `screenshotUrlOverride`.
 *
 * You can set the `ScreenshotConfig` to `undefined` to re-enable Cord's
 * default behavior.
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
