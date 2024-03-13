import { useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import type {
  ClientCreateThread,
  ClientMessageData,
  MessageAttachment,
  MessageFileAttachment,
} from '@cord-sdk/types';

import { CordContext } from '../../../contexts/CordContext.js';

const EMPTY_ATTACHMENTS: MessageAttachment[] = [];

type UseEditSubmit = {
  initialValue?: Partial<ClientMessageData>;
  messageId: string;
  threadId: string;
};

export function useEditSubmit(args: UseEditSubmit) {
  const { messageId, threadId, initialValue } = args;

  const initialAttachments = initialValue?.attachments ?? EMPTY_ATTACHMENTS;
  const { sdk: cord } = useContext(CordContext);
  return useCallback(
    ({ message }: { message: Partial<ClientMessageData> }) => {
      const initialFileAttachments = initialAttachments.filter(
        isMessageFileAttachment,
      );
      const filesAttachments = (message.attachments ?? []).filter(
        isMessageFileAttachment,
      );
      const oldAttachmentIDs = new Set(
        initialFileAttachments?.map((a) => a.id),
      );
      const newAttachmentIDs = new Set(filesAttachments?.map((a) => a.id));
      void cord?.thread.updateMessage(threadId, messageId, {
        content: message.content,
        addAttachments: filesAttachments
          .filter((a) => !oldAttachmentIDs.has(a.id))
          .map((a) => ({ id: a.id, type: 'file' })),
        removeAttachments:
          initialFileAttachments
            ?.filter((a) => !newAttachmentIDs.has(a.id))
            .map((a) => ({ id: a.id, type: 'file' })) ?? [],
      });
    },
    [cord?.thread, messageId, threadId, initialAttachments],
  );
}

type UseCreateSubmit = {
  initialValue?: Partial<ClientMessageData>;
  threadId?: string;
  createThread?: ClientCreateThread;
};

export function useCreateSubmit(args: UseCreateSubmit) {
  const { threadId, createThread } = args;
  const { sdk: cord } = useContext(CordContext);
  return useCallback(
    ({ message }: { message: Partial<ClientMessageData> }) => {
      const filesAttachments = (message.attachments ?? []).filter(
        isMessageFileAttachment,
      );
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        content: message.content ?? [],
        addAttachments: filesAttachments.map((a) => ({
          id: a.id,
          type: 'file',
        })),
        createThread: createThread ?? {
          location: { location: url },
          url,
          name: document.title,
        },
      });
    },
    [cord?.thread, createThread, threadId],
  );
}

function isMessageFileAttachment(
  attachment: MessageAttachment,
): attachment is MessageFileAttachment {
  return attachment.type === 'file';
}
