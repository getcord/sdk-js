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
