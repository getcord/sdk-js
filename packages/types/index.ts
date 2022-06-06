import type React from 'react';

type UUID = string;

export type ComponentCallback = (component: ICordComponent) => unknown;

export type StartAnnotationFlowCallback = () => Promise<DocumentAnnotationResult | null>;

export type ShowAnnotationWithComposerCallback = (
  annotation: DocumentAnnotationResult,
) => unknown;

export type Location = Record<string, string | number | boolean>;

// For backwards compatibility, will be removed along with the deprecated context prop
export type Context = Location;

export type PresenceReducerOptions = ReactPropsWithLocation<{
  excludeViewer?: boolean;
  onlyPresentUsers?: boolean;
  exactMatch?: boolean;
}>;

// navigate, if present and returning true, overrides our default navigate behaviour
export type NavigateFn = (url: string) => boolean | Promise<boolean>;

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
  react_package_version?: string;
};

export interface ICordSDK {
  init(options: CordSDKOptions): Promise<void>;
  startAnnotationFlow(): void;
  destroy(): void;
  registerComponent(component: ICordComponent): void;
  unregisterComponent(component: ICordComponent): void;
  addMonacoEditor(id: string, monacoEditor: unknown): void;
  removeMonacoEditor(id: string): void;
  addReactTree(id: string, reactTree: unknown): void;
  removeReactTree(id: string): void;
}

declare global {
  interface Window {
    CordSDK?: ICordSDK;
  }
}

export type CordComponentPropsChangedCallback = (props: object) => unknown;

export interface ICordComponent extends HTMLElement {
  render(): JSX.Element;
  readonly componentID: string;
  renderTarget: HTMLElement;
  virtual: boolean;
  props: object;
  onPropsChanged: CordComponentPropsChangedCallback | undefined;
}

type ReactPropsWithLocation<T> = T & {
  /**
   * @deprecated The context prop has been renamed to location.
   */
  context?: Location;
  location?: Location;
};

/* cord-text */

export type TextWebComponentEvents = {
  boop: Parameters<NonNullable<TextReactComponentProps['onBoop']>>;
};

export type TextReactComponentProps = {
  label?: string;
  color?: string;
  onBoop?: (boop: string) => unknown;
};

/* cord-multiple-cursors */

export type MultipleCursorsWebComponentEvents = {};

export type MultipleCursorsReactComponentProps = ReactPropsWithLocation<{}>;

/* cord-page-presence */

export type PagePresenceWebComponentEvents = {
  update: Parameters<NonNullable<PagePresenceReactComponentProps['onUpdate']>>;
};

export type PagePresenceReactComponentProps = PresenceReducerOptions & {
  durable?: boolean;
  maxUsers?: number;
  onUpdate?: (foo: number) => unknown;
};

/* cord-presence-facepile */

export type PresenceFacepileWebComponentEvents = {
  update: Parameters<
    NonNullable<PresenceFacepileReactComponentProps['onUpdate']>
  >;
};

export type PresenceFacepileReactComponentProps = PresenceReducerOptions & {
  maxUsers?: number;
  onUpdate?: (foo: number) => unknown;
};

/* cord-presence-observer */

export type PresenceObserverWebComponentEvents = {
  change: Parameters<
    NonNullable<PresenceObserverReactComponentProps['onChange']>
  >;
};

export type PresenceObserverReactComponentProps = React.PropsWithChildren<
  ReactPropsWithLocation<{
    element?: Element;
    observeDocument?: boolean;
    durable?: boolean;
    presentEvents?: string[];
    absentEvents?: string[];
    initialState?: boolean;
    onChange?: (present: boolean) => unknown;
  }>
>;

/* cord-sidebar */

export type SidebarWebComponentEvents = {
  open: Parameters<NonNullable<SidebarReactComponentProps['onOpen']>>;
  close: Parameters<NonNullable<SidebarReactComponentProps['onClose']>>;
};

export type SidebarReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  showPresence?: boolean;
  excludeViewerFromPresence?: boolean;
  showAllActivity?: boolean;
  open?: boolean;
  showLauncher?: boolean;
  onOpen?: () => unknown;
  onClose?: () => unknown;
}>;

/* cord-sidebar-launcher */

export type SidebarLauncherWebComponentEvents = {
  click: Parameters<NonNullable<SidebarLauncherReactComponentProps['onClick']>>;
};

export type BadgeStyle = 'badge' | 'badge_with_count' | 'none';

export type SidebarLauncherReactComponentProps = {
  label?: string | null;
  iconUrl?: string | null;
  inboxBadgeStyle?: BadgeStyle;
  onClick?: () => unknown;
};

/* cord-collaboration */

export type CollaborationWebComponentEvents = {};

export type CollaborationReactComponentProps = ReactPropsWithLocation<{
  showCloseButton?: boolean;
  showPresence?: boolean;
  excludeViewerFromPresence?: boolean;
  showAllActivity?: boolean;
}>;

/* cord-thread */

export type ThreadWebComponentEvents = {
  threadinfochange: Parameters<
    NonNullable<ThreadReactComponentProps['onThreadInfoChange']>
  >;
};

export type ThreadInfo = {
  messageCount: number;
};

export type ThreadReactComponentProps = ReactPropsWithLocation<{
  threadId: string;
  collapsed?: boolean;
  onThreadInfoChange?: (arg: ThreadInfo) => unknown;
}>;

/* cord-thread-list */
export type ThreadListWebComponentEvents = {
  threadclick: Parameters<
    NonNullable<ThreadListReactComponentProps['onThreadClick']>
  >;
};
export type ThreadListReactComponentProps = ReactPropsWithLocation<{
  onThreadClick?: (threadID: string) => unknown;
}>;

/* annotation types */

export type DocumentAnnotationResult = {
  annotation: MessageAnnotation;
  screenshot: Screenshot;
  blurredScreenshot: Screenshot;
};

export interface MessageAnnotation {
  id: string;
  location: DocumentLocation | null;
  draft?: boolean;
}

export type DocumentLocation = {
  selector: string;
  x: number;
  y: number;
  iframeSelector: string | null;
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
  // DEPRECATED as of 7/2/22
  /** @deprecated */
  scrollParentSelectors: string[] | null;
  /** @deprecated */
  iframeScrollParentSelectors: string[] | null;
  // DEPRECATED as of 22/2/22
  /** @deprecated */
  crossDomainIframe: boolean | null;
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
  iframeSelector: string | null;
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
  WebComponentAttributes extends string
> = (
  props: ReactComponentProps,
) => Record<WebComponentAttributes, string | undefined>;

export type ComponentAttributeConverter<
  WebComponentAttributes extends string,
  ReactComponentProps
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

export type PropsWithRef<T> = T & {
  forwardRef?: React.MutableRefObject<Element | null>;
};

const BLUR_DISPLAY_LOCATIONS = ['everywhere', 'outside_page'] as const;

export type BlurDisplayLocation = typeof BLUR_DISPLAY_LOCATIONS[number];

export function isBlurDisplayLocation(
  behavior: string,
): behavior is BlurDisplayLocation {
  return (BLUR_DISPLAY_LOCATIONS as readonly string[]).includes(behavior);
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
