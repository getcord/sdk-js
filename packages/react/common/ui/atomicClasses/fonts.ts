import type { CSSVariable, WithCSSVariableOverrides } from '../cssVariables';
import {
  cssVarWithOverride,
  cssValueWithOverride,
  cssVar,
} from '../cssVariables';
import type { Styles } from './types';

export type Font =
  | 'body'
  | 'body-emphasis'
  | 'small-light'
  | 'small'
  | 'small-emphasis'
  | 'inherit';

export type FontProps = {
  font?: Font;
};

export type FontVariablesOverride = {
  fontSize: CSSVariable;
  letterSpacing: CSSVariable;
  lineHeight: CSSVariable;
};

export const getFontStyles = ({
  font,
  cssVariablesOverride,
}: WithCSSVariableOverrides<FontProps, FontVariablesOverride>): Styles => ({
  ...(font === 'inherit' && {
    font: cssValueWithOverride('inherit', cssVariablesOverride?.fontSize),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),

  ...(font === 'body' && {
    fontFamily: cssVar('font-family'),
    fontSize: cssVarWithOverride(
      'font-size-body',
      cssVariablesOverride?.fontSize,
    ),
    fontWeight: cssVar('font-weight-regular'),
    lineHeight: cssVarWithOverride(
      'line-height-body',
      cssVariablesOverride?.lineHeight,
    ),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),

  ...(font === 'body-emphasis' && {
    fontFamily: cssVar('font-family'),
    fontSize: cssVarWithOverride(
      'font-size-body',
      cssVariablesOverride?.fontSize,
    ),
    fontWeight: cssVar('font-weight-bold'),
    lineHeight: cssVarWithOverride(
      'line-height-body',
      cssVariablesOverride?.lineHeight,
    ),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),

  ...(font === 'small-light' && {
    fontFamily: cssVar('font-family'),
    fontSize: cssVarWithOverride(
      'font-size-small',
      cssVariablesOverride?.fontSize,
    ),
    fontWeight: cssVar('font-weight-regular'),
    lineHeight: cssVarWithOverride(
      'line-height-small',
      cssVariablesOverride?.lineHeight,
    ),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),

  ...(font === 'small' && {
    fontFamily: cssVar('font-family'),
    fontSize: cssVarWithOverride(
      'font-size-small',
      cssVariablesOverride?.fontSize,
    ),
    fontWeight: cssVar('font-weight-medium'),
    lineHeight: cssVarWithOverride(
      'line-height-small',
      cssVariablesOverride?.lineHeight,
    ),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),

  ...(font === 'small-emphasis' && {
    fontFamily: cssVar('font-family'),
    fontSize: cssVarWithOverride(
      'font-size-small',
      cssVariablesOverride?.fontSize,
    ),
    fontWeight: cssVar('font-weight-bold'),
    lineHeight: cssVarWithOverride(
      'line-height-small',
      cssVariablesOverride?.lineHeight,
    ),
    letterSpacing: cssValueWithOverride(
      'inherit',
      cssVariablesOverride?.letterSpacing,
    ),
  }),
});
