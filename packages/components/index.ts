import type { BadgeStyle, JsonValue, Orientation } from '@cord-sdk/types';

export const componentNames = {
  'cord-multiple-cursors': 'MultipleCursors',
  'cord-page-presence': 'PagePresence',
  'cord-presence-facepile': 'PresenceFacepile',
  'cord-sidebar': 'Sidebar',
  'cord-sidebar-launcher': 'SidebarLauncher',
  'cord-presence-observer': 'PresenceObserver',
  'cord-thread': 'Thread',
  'cord-thread-list': 'ThreadList',
  'cord-composer': 'Composer',
  'cord-inbox-launcher': 'InboxLauncher',
  'cord-inbox': 'Inbox',
  'cord-settings': 'Settings',
  'cord-floating-threads': 'FloatingThreads',
  'cord-selection-comments': 'SelectionComments',
  'cord-notification-list': 'NotificationList',
  'cord-message': 'Message',
  'cord-thread-facepile': 'ThreadFacepile',
  'cord-notification-list-launcher': 'NotificationListLauncher',
  'cord-pin': 'Pin',
} as const;

export type ElementName = keyof typeof componentNames;
export type ComponentName = (typeof componentNames)[ElementName];

const InboxSharedAttributes = {
  'show-settings': 'boolean',
} as const;

const InboxSpecificAttributes = {
  'show-close-button': 'boolean',
} as const;

const NotificationListAttributes = {
  'max-count': 'number',
  'fetch-additional-count': 'number',
} as const;

export const componentAttributes = {
  MultipleCursors: {
    context: 'json',
    location: 'json',
  },
  PagePresence: {
    context: 'json',
    location: 'json',
    durable: 'boolean',
    'max-users': 'number',
    'exclude-viewer': 'boolean',
    'only-present-users': 'boolean',
    orientation: 'orientation',
  },
  PresenceFacepile: {
    context: 'json',
    location: 'json',
    'max-users': 'number',
    'exclude-viewer': 'boolean',
    'only-present-users': 'boolean',
    'exact-match': 'boolean',
    orientation: 'orientation',
  },
  PresenceObserver: {
    context: 'json',
    location: 'json',
    'present-events': 'array',
    'absent-events': 'array',
    'observe-document': 'boolean',
    durable: 'boolean',
    'initial-state': 'boolean',
  },
  Sidebar: {
    context: 'json',
    location: 'json',
    open: 'boolean',
    'show-close-button': 'boolean',
    'show-inbox': 'boolean',
    'show-presence': 'boolean',
    'show-launcher': 'boolean',
    'show-all-activity': 'boolean',
    'exclude-viewer-from-presence': 'boolean',
    'show-pins-on-page': 'boolean',
    'thread-name': 'string',
  },
  SidebarLauncher: {
    disabled: 'boolean',
    label: 'string',
    'icon-url': 'string',
    'inbox-badge-style': 'badge-style',
  },
  Thread: {
    context: 'json',
    location: 'json',
    'thread-id': 'string',
    'thread-name': 'string',
    metadata: 'json',
    collapsed: 'boolean',
    autofocus: 'boolean',
    'show-header': 'boolean',
    'show-placeholder': 'boolean',
    'composer-expanded': 'boolean',
    'thread-options': 'json',
  },
  ThreadList: {
    location: 'json',
    filter: 'json',
    'show-screenshot-preview-in-message': 'boolean',
    'highlight-open-floating-thread': 'boolean',
    mode: 'string',
  },
  Composer: {
    location: 'json',
    'thread-id': 'string',
    'thread-name': 'string',
    autofocus: 'boolean',
    'show-expanded': 'boolean',
  },
  InboxLauncher: {
    label: 'string',
    disabled: 'boolean',
    'icon-url': 'string',
    'inbox-badge-style': 'badge-style',
    'show-inbox-on-click': 'boolean',
    ...InboxSharedAttributes,
  },
  Inbox: { ...InboxSharedAttributes, ...InboxSpecificAttributes },
  Settings: {},
  FloatingThreads: {
    location: 'json',
    disabled: 'boolean',
    'show-button': 'boolean',
    'button-label': 'string',
    'thread-name': 'string',
    'show-screenshot-preview': 'boolean',
  },
  SelectionComments: {
    location: 'json',
    'button-label': 'string',
    'icon-url': 'string',
    'thread-name': 'string',
  },
  NotificationList: {
    ...NotificationListAttributes,
  },
  Message: {
    'thread-id': 'string',
    'message-id': 'string',
  },
  ThreadFacepile: {
    'thread-id': 'string',
    'max-users': 'number',
    'show-extra-users-numbers': 'boolean',
    orientation: 'orientation',
  },
  NotificationListLauncher: {
    label: 'string',
    'icon-url': 'string',
    'badge-style': 'badge-style',
    disabled: 'boolean',
    ...NotificationListAttributes,
  },
  Pin: {
    location: 'json',
    'thread-id': 'string',
    'thread-name': 'string',
  },
} as const;

export type PropertyTypes = {
  json: JsonValue;
  boolean: boolean;
  number: number;
  string: string;
  array: any[];
  'badge-style': BadgeStyle;
  orientation: Orientation;
};

const enumAttributeConverter =
  <T extends readonly string[]>(possibleValues: T) =>
  (value: string | null): T[number] | undefined =>
    value === null
      ? undefined
      : possibleValues.indexOf(value) !== -1
      ? value
      : undefined;

export const attributeToPropertyConverters: {
  [T in keyof PropertyTypes]: (
    value: string | null,
  ) => PropertyTypes[T] | undefined;
} = {
  json: (value) => (value ? (JSON.parse(value) as JsonValue) : undefined),
  boolean: (value) => (value === null ? undefined : value === 'true'),
  number: (value) => (value ? parseInt(value) : undefined),
  string: (value) => value ?? undefined,
  array: (value) => value?.split(',').filter((x) => x.length > 0),
  'badge-style': enumAttributeConverter([
    'none',
    'badge',
    'badge_with_count',
  ] as const),
  orientation: enumAttributeConverter(['vertical', 'horizontal'] as const),
};

export const propertyToAttributeConverters: {
  [T in keyof PropertyTypes]: (
    value: PropertyTypes[T] | undefined,
  ) => string | undefined;
} = {
  json: (value): string | undefined =>
    value !== undefined ? JSON.stringify(value) : undefined,
  boolean: (value) => value?.toString(),
  number: (value) => value?.toString(),
  string: (value) => (value === undefined ? undefined : value || ''),
  array: (value) => value?.join(','),
  'badge-style': (value) => (value === undefined ? undefined : value || ''),
  orientation: (value) => (value === undefined ? undefined : value || ''),
};

export function attributeNameToPropName(attributeName: string): string {
  return attributeName.replace(/-([a-z])/g, function (_, w) {
    return w.toUpperCase();
  });
}

export type ComponentAttributeTypes<T extends string> = Record<
  T,
  keyof PropertyTypes
>;

export const propsToAttributeConverter =
  <U extends string>(attributeMetadata: ComponentAttributeTypes<U>) =>
  <T extends string>(props: Partial<Record<T, any>>) => {
    const result: Partial<Record<U, any>> = {};
    for (const key of Object.keys(attributeMetadata)) {
      const attributeName = key as U;
      const propName = attributeNameToPropName(attributeName) as T;
      if (propName in props) {
        result[attributeName] = propertyToAttributeConverters[
          attributeMetadata[attributeName]
        ](props[propName]);
      }
    }
    return result;
  };
