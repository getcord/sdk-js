import { BadgeStyle, JsonValue } from '@cord-sdk/types';

export const componentNames = {
  'cord-collaboration': 'Collaboration',
  'cord-page-presence': 'PagePresence',
  'cord-presence-facepile': 'PresenceFacepile',
  'cord-sidebar': 'Sidebar',
  'cord-sidebar-launcher': 'SidebarLauncher',
  'cord-presence-observer': 'PresenceObserver',
  'cord-text': 'Text',
  'cord-thread': 'Thread',
} as const;

export type ElementName = keyof typeof componentNames;
export type ComponentName = typeof componentNames[ElementName];

export const componentAttributes = {
  Collaboration: {
    context: 'json',
    'show-close-button': 'boolean',
    'show-presence': 'boolean',
  },
  PagePresence: {
    context: 'json',
    durable: 'boolean',
    'max-users': 'number',
    'exclude-viewer': 'boolean',
    'only-present-users': 'boolean',
  },
  PresenceFacepile: {
    context: 'json',
    'max-users': 'number',
    'exclude-viewer': 'boolean',
    'only-present-users': 'boolean',
    'exact-match': 'boolean',
  },
  PresenceObserver: {
    context: 'json',
    'present-events': 'array',
    'absent-events': 'array',
    'observe-document': 'boolean',
    durable: 'boolean',
    'initial-state': 'boolean',
  },
  Sidebar: {
    context: 'json',
    open: 'boolean',
    'show-close-button': 'boolean',
    'show-presence': 'boolean',
    'show-launcher': 'boolean',
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
    'thread-id': 'string',
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

const enumAttributeConverter = <T extends readonly string[]>(
  possibleValues: T,
) => (value: string | null): T[number] | undefined =>
  value === null
    ? undefined
    : possibleValues.includes(value)
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

export const propsToAttributeConverter = <U extends string>(
  attributeMetadata: ComponentAttributeTypes<U>,
) => <T extends string>(props: Partial<Record<T, any>>) => {
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
