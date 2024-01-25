import type { ClientUserData, Reaction } from '@cord-sdk/types';
import { useUserData, useViewerData } from '../../hooks/user.ts';

export function useUsersByReactions(reactions: Reaction[] | undefined): {
  [reaction: string]: ClientUserData[];
} {
  const viewerData = useViewerData();
  const viewerID = viewerData?.id;

  const reactionUserIDs = new Set(
    reactions?.map((reaction) => reaction.userID),
  );

  const reactionUserIDsArray = [...reactionUserIDs];

  const reactionUsers = useUserData(reactionUserIDsArray);

  const usersByReaction: { [reaction: string]: ClientUserData[] } = {};

  if (reactions) {
    for (const reaction of reactions) {
      if (!usersByReaction[reaction.reaction]) {
        usersByReaction[reaction.reaction] = [];
      }

      const reactionUser = reactionUsers[reaction.userID];

      if (reactionUser) {
        if (reaction.userID === viewerID) {
          // show the current viewer user closest to the reaction
          usersByReaction[reaction.reaction].unshift(reactionUser);
        } else {
          usersByReaction[reaction.reaction].push(reactionUser);
        }
      }
    }
  }

  return usersByReaction;
}
