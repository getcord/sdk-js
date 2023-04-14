import { experimental, thread } from '@cord-sdk/react';

export function ThreadFacepile({ threadId }: { threadId: string }) {
  const threadSummary = thread.useThreadSummary(threadId);
  const userIDs = threadSummary?.participants.map((u) => u.userID ?? '') ?? [];
  return <experimental.Facepile users={userIDs} />;
}
