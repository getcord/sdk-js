import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '../../../common/ui/cssVariables.ts';
import { MODIFIERS } from '../../../common/ui/modifiers.ts';
import * as classes from './UserReferenceElement.classnames.ts';
export const { userDisplayName, userReferenceElement } = classes;

globalStyle(`.${userReferenceElement}`, {
  color: cssVar('color-content-emphasis'),
  cursor: 'pointer',
  fontWeight: cssVar('font-weight-bold'),
  textDecoration: 'none',
});

globalStyle(
  `:where(.${userReferenceElement}.${MODIFIERS.highlighted}) .${userDisplayName}`,
  {
    textDecoration: 'underline',
  },
);
