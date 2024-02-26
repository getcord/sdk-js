import type { GlobalStyleRule, CSSProperties } from '@vanilla-extract/css';
import {
  globalStyle as defaultGlobalStyle,
  keyframes,
} from '@vanilla-extract/css';
import { cordifyClassname } from '../util.js';

export type { CSSProperties };
export { globalStyle, defaultGlobalStyle, keyframes };

export const CORD_COMPONENT_BASE_CLASS = 'cord-component';
export const CORD_V3 = cordifyClassname('v3');
function globalStyle(selector: string, rule: GlobalStyleRule) {
  // We are wrapping `selector` in a `:where()`, and `:where(*::<pseudo-element>)`
  // is *not* a valid selector.
  if (selector.includes('::')) {
    throw new Error(
      `Cannot use pseudo selector with \`globalStyle\`. 
      Please use \`defaultGlobalStyle\` and prepend CORD_V3 manually
      Selector: ${selector}`,
    );
  }
  // We wrap `selector` in a `:where` to keep the specificity of our selectors to 0,1,0
  const v3Selector = `.${CORD_COMPONENT_BASE_CLASS}:where(.${CORD_V3}) :where(${selector})`;
  // Cord 3.0 were our first fully CSS customizable components.
  // To avoid clashes with the new set of components (4.0),
  // we version the CSS.
  return defaultGlobalStyle(v3Selector, rule);
}
