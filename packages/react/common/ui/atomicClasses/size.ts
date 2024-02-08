import type {
  CSSVariable,
  SpaceVar,
  WithCSSVariableOverrides,
} from '../cssVariables.ts';
import { cssVarWithOverride } from '../cssVariables.ts';

export type SizeProps = {
  width?: SpaceVar;
  height?: SpaceVar;
};

export type SizeVariablesOverride = {
  width: CSSVariable;
  height: CSSVariable;
};

export const getSizeStyles = ({
  width,
  height,
  cssVariablesOverride,
}: WithCSSVariableOverrides<SizeProps, SizeVariablesOverride>) => ({
  width: cssVarWithOverride(
    width ? `space-${width}` : undefined,
    cssVariablesOverride?.width,
  ),
  height: cssVarWithOverride(
    height ? `space-${height}` : undefined,
    cssVariablesOverride?.height,
  ),
});
