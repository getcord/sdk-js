import { globalStyle, keyframes } from '@vanilla-extract/css';
import { cssVar } from '../../common/ui/cssVariables';
import { getModifiedSelector } from '../../common/ui/modifiers';
import { button } from './Button.classnames';
import * as classes from './Icon.classnames';
import { emptyStateContainer } from '@cord-sdk/react/components/helpers/EmptyStateWithIcon.classnames';

export default classes;

const { icon, large, medium, spinnerIcon } = classes;

globalStyle(`.${icon}`, {
  // Display block removes line after svg
  display: 'block',
});

globalStyle(`:where(.${icon}).${large}`, {
  width: cssVar('space-l'),
  height: cssVar('space-l'),
});

globalStyle(`:where(.${icon}).${medium}`, {
  width: cssVar('space-m'),
  height: cssVar('space-m'),
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

//SpinnerIcon
globalStyle(`:where(.${icon}).${spinnerIcon}`, {
  animation: `${spin} 1s linear infinite`,
});
// The SpinnerIcon in a loading Button
globalStyle(
  getModifiedSelector('loading', `.${button} :where(.${icon}.${spinnerIcon})`),
  {
    left: 0,
    margin: 'auto',
    position: 'absolute',
    right: 0,
  },
);

// Button - Icon
globalStyle(
  getModifiedSelector(
    'loading',
    `:where(.${button}) .${icon}:not(.${spinnerIcon})`,
  ),
  {
    visibility: 'hidden',
  },
);

//  Button - img Icon
globalStyle(getModifiedSelector('disabled', `:where(.${button}) img.${icon}`), {
  opacity: 0.5,
});

globalStyle(`.${emptyStateContainer} :where(.${icon})`, {
  height: cssVar('space-2xl'),
  width: cssVar('space-2xl'),
  marginBottom: cssVar('space-2xs'),
});
