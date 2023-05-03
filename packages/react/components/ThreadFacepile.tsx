import { Facepile, thread } from '@cord-sdk/react';

export function ThreadFacepile({ threadId }: { threadId: string }) {
  const threadSummary = thread.useThreadSummary(threadId);
  // TODO (nickfil22): Remove nullables from our ThreadParticipant GQL object.
  // If we have thread participants, it means we also have and id and timestamp.
  // We shouldn't have to null check here.
  const userIDs = (threadSummary?.participants ?? [])
    .map((u) => u.userID)
    .filter(isDefined);
  return <Facepile users={userIDs} />;
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
