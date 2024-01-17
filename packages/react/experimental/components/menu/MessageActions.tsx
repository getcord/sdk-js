import * as React from 'react';
import type { ClientMessageData } from '@cord-sdk/types';
import type { RefObject } from 'react';
export type MessageActionsProps = {
  closeMenu: () => void;
  threadID: string;
  message: ClientMessageData;
  showSeparator: boolean;
  messageRef?: RefObject<HTMLDivElement>;
};
/**
 * @todo Implement this component
 */
export function MessageActions(_props: MessageActionsProps) {
  return <></>;
}
