/**
 * Prepend "cord-" to a classname. Useful mostly to grep all places
 * where we've added a stable classname.
 */
export function cordifyClassname(className: string) {
  return `cord-${className}`;
}

/**
 * Returns a work in singular or plural form depending on given number. This includes the count, e.g.:
 * - `pluralize(0, 'hour')` -> '0 hours'
 * - `pluralize(1, 'hour')` -> '1 hour'
 * - `pluralize(2, 'hour')` -> '2 hours'
 * - `pluralize(0, 'box', 'boxes')` -> '0 boxes'
 * - `pluralize(1, 'box', 'boxes')` -> '1 box'
 */
export function pluralize(n: number, what: string, plural?: string) {
  return `${n} ${pluralizeWord(n, what, plural)}`;
}

/**
 * Returns a work in singular or plural form depending on given number. This does not include the count, e.g.:
 * - `pluralizeWord(0, 'hour')` -> 'hours'
 * - `pluralizeWord(1, 'hour')` -> 'hour'
 * - `pluralizeWord(2, 'hour')` -> 'hours'
 * - `pluralizeWord(0, 'box', 'boxes')` -> 'boxes'
 * - `pluralizeWord(1, 'box', 'boxes')` -> 'box'
 */
export function pluralizeWord(
  n: number,
  what: string,
  plural: string = what + 's',
) {
  return n === 1 ? what : plural;
}

export function logComponentInstantiation(name: string) {
  (window.CordSDK as any)?.__CORD_OPENSOURCE_COMPONENTS.add(name);
}

const TOTAL_NUM_OF_PALETTES = 8;
export function getStableColorPalette(userId: string) {
  let simpleHash = 0;
  for (const char of userId) {
    simpleHash += char.charCodeAt(0);
  }
  return (simpleHash % TOTAL_NUM_OF_PALETTES) + 1; // 1-indexed;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function getFileSizeString(size: number) {
  let fileSizeString;
  if (size > 1000000) {
    // larger than a mb then we convert to MB
    fileSizeString = (size / 1000000).toFixed() + ' MB';
  } else if (size > 1000) {
    // larger than a kb then we convert to KB
    fileSizeString = (size / 1000).toFixed() + ' KB';
  } else {
    // converts to bytes
    fileSizeString = size.toString() + ' bytes';
  }
  return fileSizeString;
}
