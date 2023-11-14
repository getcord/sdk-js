import { globalStyle } from '@vanilla-extract/css';
import { cordifyClassname } from '../common/util';
import { ZINDEX } from '@cord-sdk/react/common/ui/zIndex';
import { cssVar } from '@cord-sdk/react/common/ui/cssVariables';

export const tooltip = cordifyClassname('tooltip');
globalStyle(`.${tooltip}`, {
  backgroundColor: cssVar('tooltip-background-color'),
  borderRadius: cssVar('border-radius-small'),
  boxShadow: cssVar('shadow-small'),
  color: cssVar('tooltip-content-color'),
  maxWidth: `calc(${cssVar('space-l')} * 10)`,
  overflowWrap: 'break-word',
  padding: `${cssVar('space-3xs')} ${cssVar('space-2xs')}`,
  pointerEvents: 'none',
  textAlign: 'center',
  width: 'fit-content',
  zIndex: ZINDEX.popup,
});
export const tooltipSubtitle = cordifyClassname('tooltip-subtitle');
globalStyle(`.${tooltipSubtitle}`, {
  filter: 'opacity(0.65)',
});
export const tooltipLabel = cordifyClassname('tooltip-label');
export const nowrap = cordifyClassname('no-wrap');
