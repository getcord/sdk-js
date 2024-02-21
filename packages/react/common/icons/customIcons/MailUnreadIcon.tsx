import * as React from 'react';
import { CustomSvgIcon } from './CustomSvgIcon.js';

// Taken from https://github.com/microsoft/fluentui-system-icons (MIT license),
// this is mailUnread16Regular.
export function MailUnreadIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <CustomSvgIcon viewBox="0 0 16 16" {...props}>
      <path d="M14 5.23A2 2 0 1 0 11.06 3 2 2 0 0 0 14 5.23ZM4 3h6.04a3.02 3.02 0 0 0 0 1H4a1 1 0 0 0-1 1v.74l5 2.7 3.94-2.13a3 3 0 0 0 2.06.02V11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2ZM3 6.88V11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6.88L8.24 9.44a.5.5 0 0 1-.48 0L3 6.88Z" />
    </CustomSvgIcon>
  );
}
