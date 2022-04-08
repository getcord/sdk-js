type UUID = string;

export type ComponentCallback = (component: ICordComponent) => unknown;

export type StartAnnotationFlowCallback = () => Promise<DocumentAnnotationResult | null>;

export type ShowAnnotationWithComposerCallback = (
  annotation: DocumentAnnotationResult,
) => unknown;

export type Context = Record<string, string | number | boolean>;

export type PresenceReducerOptions = ReactPropsWithContext<{
  excludeViewer?: boolean;
  onlyPresentUsers?: boolean;
  exactMatch?: boolean;
}>;

// navigate, if present and returning true, overrides our default navigate behaviour
export type NavigateFn = (url: string) => boolean | Promise<boolean>;

export type CordSDKOptions = {
  session_token?: string;
  client_auth_token?: string;
  navigate?: NavigateFn | null;
  enable_tasks?: boolean;
  enable_annotations?: boolean;
};

export interface ICordSDK {
  init(options: CordSDKOptions): Promise<void>;
  startAnnotationFlow(): void;
  destroy(): void;
  registerComponent(component: ICordComponent): void;
  unregisterComponent(component: ICordComponent): void;
  // addMonacoEditor(id: string, monacoEditor: MonacoEditorInstance): void;
  // removeMonacoEditor(id: string): void;
  // addReactTree(id: string, reactTree: ReactTreeInstance): void;
  // removeReactTree(id: string): void;
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

type ReactPropsWithContext<T> = T & {
  context?: Context;
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

export type MultipleCursorsReactComponentProps = ReactPropsWithContext<{}>;

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
  ReactPropsWithContext<{
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

export type SidebarReactComponentProps = ReactPropsWithContext<{
  showCloseButton?: boolean;
  showPresence?: boolean;
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

export type CollaborationReactComponentProps = ReactPropsWithContext<{
  showCloseButton?: boolean;
  showPresence?: boolean;
  showAllActivity?: boolean;
}>;

/* cord-thread */

export type ThreadWebComponentEvents = {
  threadcreated: Parameters<
    NonNullable<ThreadReactComponentProps['onThreadCreated']>
  >;
};

export type ThreadReactComponentProps = ReactPropsWithContext<{
  threadId?: UUID;
  onThreadCreated?: (threadId: UUID) => unknown;
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
