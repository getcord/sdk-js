import * as React from 'react';
import { CustomSvgIcon } from '../customIcons/CustomSvgIcon';

export function SlackIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <CustomSvgIcon viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M5.941 11.847c0 .81-.66 1.47-1.47 1.47-.81 0-1.471-.66-1.471-1.47 0-.81.661-1.47 1.47-1.47h1.471v1.47ZM6.682 11.847c0-.81.661-1.47 1.47-1.47.81 0 1.472.66 1.472 1.47v3.682c0 .81-.662 1.471-1.471 1.471-.81 0-1.47-.661-1.47-1.47v-3.683ZM8.153 5.941c-.81 0-1.47-.66-1.47-1.47 0-.81.66-1.471 1.47-1.471.81 0 1.47.661 1.47 1.47v1.471h-1.47ZM8.153 6.682c.81 0 1.47.662 1.47 1.471 0 .81-.66 1.47-1.47 1.47H4.471C3.66 9.624 3 8.964 3 8.154c0-.81.661-1.47 1.47-1.47h3.683ZM14.059 8.153c0-.81.66-1.47 1.47-1.47.81 0 1.471.66 1.471 1.47 0 .81-.661 1.47-1.47 1.47h-1.471v-1.47ZM13.318 8.153c0 .81-.662 1.47-1.471 1.47-.81 0-1.47-.66-1.47-1.47V4.471c0-.81.66-1.471 1.47-1.471.81 0 1.47.661 1.47 1.47v3.683ZM11.847 14.059c.81 0 1.47.66 1.47 1.47 0 .81-.66 1.471-1.47 1.471-.81 0-1.47-.661-1.47-1.47v-1.471h1.47ZM11.847 13.318c-.81 0-1.47-.662-1.47-1.471 0-.81.66-1.47 1.47-1.47h3.682c.81 0 1.471.66 1.471 1.47 0 .81-.661 1.47-1.47 1.47h-3.683Z"
        fill="currentColor"
      />
    </CustomSvgIcon>
  );
}
