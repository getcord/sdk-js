import * as React from 'react';

export type ThreadActionsProps = {
  closeMenu: () => void;
  showSlackChannelSelectMenu: () => void;
  showShareToEmailMenu: () => void;
  threadID: string;
  markThreadAsRead?: (threadID: string) => void;
  isSlackWorkspaceConnected?: boolean;
};

/**
 * @todo Implement this component
 */
export function ThreadActions(_props: ThreadActionsProps) {
  return <></>;
}
