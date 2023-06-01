import { cordifyClassname } from '@cord-sdk/react/common/util';

export const MODIFIERS = {
  loading: cordifyClassname('loading'),
  disabled: cordifyClassname('disabled'),
  notPresent: cordifyClassname('not-present'),
  present: cordifyClassname('present'),
  noReactions: cordifyClassname('no-reactions'),
  deleted: cordifyClassname('deleted'),
  unseen: cordifyClassname('unseen'),
  editing: cordifyClassname('editing'),
};

/**
 * Applies one or more `modifier` class to the `selector`.
 * The CSS specificity is the one of `selector`, as we remove
 * the modifier specificity using `:where()`.
 */
export function getModifiedSelector(
  modifiers: keyof typeof MODIFIERS | Array<keyof typeof MODIFIERS>,
  selector: string,
) {
  const modifiersToApply = Array.isArray(modifiers)
    ? modifiers.map((modifier) => MODIFIERS[modifier]).join('.')
    : `.${MODIFIERS[modifiers]}`;
  return `:where(${modifiersToApply})${selector}`;
}
