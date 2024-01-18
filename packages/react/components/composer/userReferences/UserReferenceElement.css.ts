import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '@cord-sdk/react/common/ui/cssVariables.ts';
import { MODIFIERS } from '@cord-sdk/react/common/ui/modifiers.ts';
import * as classes from '@cord-sdk/react/components/composer/userReferences/UserReferenceElement.classnames.ts';
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
