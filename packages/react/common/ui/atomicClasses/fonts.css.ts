import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '../cssVariables';
import { cordifyClassname } from '../../util';

export const fontBody = cordifyClassname('font-body');
globalStyle('font-body', {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-body'),
  fontWeight: cssVar('font-weight-regular'),
  lineHeight: cssVar('line-height-body'),
  letterSpacing: 'inherit',
});

export const fontBodyEmphasis = cordifyClassname('font-body-emphasis');
globalStyle('font-body-emphasis', {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-body'),
  fontWeight: cssVar('font-weight-bold'),
  lineHeight: cssVar('line-height-body'),
  letterSpacing: 'inherit',
});

export const fontSmallLight = cordifyClassname('font-small-light');
globalStyle('font-small-light', {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-small'),
  fontWeight: cssVar('font-weight-regular'),
  lineHeight: cssVar('line-height-small'),
  letterSpacing: 'inherit',
});

export const fontSmall = cordifyClassname('font-small');
globalStyle('font-small', {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-small'),
  fontWeight: cssVar('font-weight-medium'),
  lineHeight: cssVar('line-height-small'),
  letterSpacing: 'inherit',
});

export const fontSmallEmphasis = cordifyClassname('font-small-emphasis');
globalStyle('font-small-emphasis', {
  fontFamily: cssVar('font-family'),
  fontSize: cssVar('font-size-small'),
  fontWeight: cssVar('font-weight-bold'),
  lineHeight: cssVar('line-height-small'),
  letterSpacing: 'inherit',
});
