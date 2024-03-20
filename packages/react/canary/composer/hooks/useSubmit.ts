import { useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import type {
  ClientCreateThread,
  ClientMessageData,
  MessageAttachment,
  MessageFileAttachment,
  Reaction,
} from '@cord-sdk/types';
import { CordContext } from '../../../contexts/CordContext.js';

const EMPTY_ATTACHMENTS: MessageAttachment[] = [];
const EMPTY_REACTIONS: Reaction[] = [];

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
      const { reactions, attachments, ...restMessage } = message;

      const initialFileAttachments = initialAttachments.filter(
        isMessageFileAttachment,
      );
      const filesAttachments = (attachments ?? []).filter(
        isMessageFileAttachment,
      );
      const oldAttachmentIDs = new Set(
        initialFileAttachments?.map((a) => a.id),
      );
      const newAttachmentIDs = new Set(filesAttachments?.map((a) => a.id));
      const initialReactions = new Set(
        (initialValue?.reactions ?? []).map((r) => r.reaction) ??
          EMPTY_REACTIONS,
      );
      const newReactions = new Set(
        (reactions ?? []).map((r) => r.reaction) ?? EMPTY_REACTIONS,
      );
      void cord?.thread.updateMessage(threadId, messageId, {
        ...restMessage,
        addAttachments: filesAttachments
          .filter((a) => !oldAttachmentIDs.has(a.id))
          .map((a) => ({ id: a.id, type: 'file' })),
        removeAttachments:
          initialFileAttachments
            ?.filter((a) => !newAttachmentIDs.has(a.id))
            .map((a) => ({ id: a.id, type: 'file' })) ?? [],
        addReactions:
          (reactions ?? [])
            .filter((r) => !initialReactions.has(r.reaction))
            .map((r) => r.reaction) ?? [],
        removeReactions:
          (initialValue?.reactions ?? [])
            .filter((r) => !newReactions.has(r.reaction))
            .map((r) => r.reaction) ?? [],
      });
    },
    [
      cord?.thread,
      messageId,
      threadId,
      initialAttachments,
      initialValue?.reactions,
    ],
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
      const { reactions, content, attachments, ...restMessage } = message;
      const filesAttachments = (attachments ?? []).filter(
        isMessageFileAttachment,
      );
      const url = window.location.href;
      void cord?.thread.sendMessage(threadId ?? uuid(), {
        ...restMessage,
        content: content ?? [],
        addAttachments: filesAttachments.map((a) => ({
          id: a.id,
          type: 'file',
        })),
        addReactions: (reactions ?? []).map((r) => r.reaction),
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
