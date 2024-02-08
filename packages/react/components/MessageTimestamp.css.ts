import { globalStyle } from '@vanilla-extract/css';
import { cssVar } from '../common/ui/cssVariables.ts';
import { getModifiedSelector, MODIFIERS } from '../common/ui/modifiers.ts';
import { timestamp } from './Timestamp.classnames.ts';
export { timestamp };
import { notificationContainer } from './Notification.classnames.ts';

globalStyle(`.${timestamp}`, {
  display: 'flex',
  marginTop: cssVar('space-3xs'),
  color: cssVar('color-content-secondary'),
  alignSelf: 'baseline',
});
globalStyle(getModifiedSelector('unseen', ` .${timestamp}::after`), {
  background: cssVar('notification-unread-badge-color'),
  content: '',
  height: '8px',
  width: '8px',
  borderRadius: '50%',
  marginLeft: cssVar('space-3xs'),
  marginTop: cssVar('space-3xs'),
});

/** Styles when used inside other components */
globalStyle(`:where(.cord-component-message) .${timestamp}`, {
  gridArea: 'timestamp',
});

globalStyle(`:where(.${notificationContainer}) .${timestamp}`, {
  color: cssVar('color-content-secondary'),
  gridArea: 'timestamp',
});

globalStyle(
  `:where(.${notificationContainer}.${MODIFIERS.unseen}) .${timestamp}`,
  {
    color: cssVar('color-notification'),
    fontWeight: cssVar('font-weight-bold'),
  },
);

globalStyle(`:where(.${notificationContainer}) .${timestamp}`, {
  marginTop: 0,
});
globalStyle(`:where(.${notificationContainer}) .${timestamp}::after`, {
  display: 'none', // Do not show unseen badge
});
