import type { BadgeStyle, JsonValue } from '@cord-sdk/types';

export const componentNames = {
  'cord-collaboration': 'Collaboration',
  'cord-multiple-cursors': 'MultipleCursors',
  'cord-page-presence': 'PagePresence',
  'cord-presence-facepile': 'PresenceFacepile',
  'cord-sidebar': 'Sidebar',
  'cord-sidebar-launcher': 'SidebarLauncher',
  'cord-presence-observer': 'PresenceObserver',
  'cord-text': 'Text',
  'cord-thread': 'Thread',
  'cord-thread-list': 'ThreadList',
  'cord-inbox-launcher': 'InboxLauncher',
  'cord-inbox': 'Inbox',
} as const;

export type ElementName = keyof typeof componentNames;
export type ComponentName = typeof componentNames[ElementName];

export const componentAttributes = {
  Collaboration: {
    context: 'json',
    location: 'json',
    'show-close-button': 'boolean',
    'show-presence': 'boolean',
    'show-all-activity': 'boolean',
    'exclude-viewer-from-presence': 'boolean',
    'show-pins-on-page': 'boolean',
  },
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
  },
  PresenceFacepile: {
    context: 'json',
    location: 'json',
    'max-users': 'number',
    'exclude-viewer': 'boolean',
    'only-present-users': 'boolean',
    'exact-match': 'boolean',
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
    'show-presence': 'boolean',
    'show-launcher': 'boolean',
    'show-all-activity': 'boolean',
    'exclude-viewer-from-presence': 'boolean',
    'show-pins-on-page': 'boolean',
  },
  SidebarLauncher: {
    label: 'string',
    'icon-url': 'string',
    'inbox-badge-style': 'badge-style',
  },
  Text: {
    label: 'string',
    color: 'string',
  },
  Thread: {
    context: 'json',
    location: 'json',
    'thread-id': 'string',
    collapsed: 'boolean',
    'show-header': 'boolean',
  },
  ThreadList: {
    location: 'json',
  },
  InboxLauncher: {
    label: 'string',
    'icon-url': 'string',
    'inbox-badge-style': 'badge-style',
  },
  Inbox: {
    'show-close-button': 'boolean', // need to change underlying component to implement this
    'show-all-activity': 'boolean',
  },
} as const;

export type PropertyTypes = {
  json: JsonValue;
  boolean: boolean;
  number: number;
  string: string;
  array: any[];
  'badge-style': BadgeStyle;
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
  boolean: (value) => value === 'true',
  number: (value) => (value ? parseInt(value) : undefined),
  string: (value) => value ?? undefined,
  array: (value) => value?.split(',').filter((x) => x.length > 0),
  'badge-style': enumAttributeConverter([
    'none',
    'badge',
    'badge_with_count',
  ] as const),
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
