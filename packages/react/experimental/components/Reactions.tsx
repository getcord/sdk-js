import * as React from 'react';
import cx from 'classnames';

import { forwardRef, useCallback, useContext } from 'react';
import type { Reaction } from '@cord-sdk/types/message.ts';
import {
  getUnseenReactions,
  isViewerPreviouslyAddedReaction,
} from '../../common/util.js';
import { useUsersByReactions } from '../../common/effects/useUsersByReactions.ts';
import { useMessage, useThread } from '../../hooks/thread.ts';
import { AddReactionButton } from './AddReactionButton.tsx';
import withCord from './hoc/withCord.js';
import { DefaultTooltip, WithTooltip } from './WithTooltip.tsx';
import { useEmojiPicker } from './helpers/EmojiPicker.tsx';
import { ReactionPill } from './message/ReactionPill.tsx';
import { useCordTranslation, CordContext } from '@cord-sdk/react';
import * as classes from '@cord-sdk/react/components/Reactions.classnames.ts';
import { useViewerData } from '@cord-sdk/react/hooks/user.ts';

export type ReactionsProps = {
  threadId?: string;
  messageId?: string;
  showAddReactionButton?: boolean;
  showReactionList?: boolean;
  className?: string;
};

export const Reactions = withCord<React.PropsWithChildren<ReactionsProps>>(
  React.forwardRef(function Reactions(
    {
      threadId,
      messageId,
      className,
      showAddReactionButton = true,
      showReactionList = true,
    }: ReactionsProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const viewerData = useViewerData();
    const { thread } = useThread(threadId ?? '');
    const message = useMessage(messageId ?? '');

    const { sdk: cordSDK } = useContext(CordContext);
    const threadSDK = cordSDK?.thread;

    const onAddReaction = useCallback(
      (unicodeReaction: string) => {
        if (threadSDK && threadId && messageId) {
          void threadSDK.updateMessage(threadId, messageId, {
            addReactions: [unicodeReaction],
          });
        }
      },
      [messageId, threadId, threadSDK],
    );

    const onDeleteReaction = useCallback(
      (unicodeReaction: string) => {
        if (threadSDK && threadId && messageId) {
          void threadSDK.updateMessage(threadId, messageId, {
            removeReactions: [unicodeReaction],
          });
        }
      },
      [messageId, threadId, threadSDK],
    );

    if (!thread || !message) {
      return (
        <>
          {showAddReactionButton && (
            <AddReactionButton disabled={true} canBeReplaced />
          )}
        </>
      );
    }

    const unseenReactionsUnicode = getUnseenReactions(
      thread,
      message,
      viewerData?.id,
    ).map((reaction) => reaction.reaction);

    return (
      <ReactionsInner
        ref={ref}
        reactions={message.reactions}
        unseenReactionsUnicode={unseenReactionsUnicode}
        onAddReaction={onAddReaction}
        onDeleteReaction={onDeleteReaction}
        showAddReactionButton={showAddReactionButton}
        showReactionList={showReactionList}
        className={className}
      />
    );
  }),
  'Reactions',
);

export type ReactionsInnerProps = {
  reactions: Reaction[];
  unseenReactionsUnicode: string[];
  onDeleteReaction: (unicodeReaction: string) => void;
  onAddReaction: (unicodeReaction: string) => void;
  showAddReactionButton: boolean;
  showReactionList: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type ReactionsInnerPropsWithClassname = ReactionsInnerProps & {
  className?: string;
};

const ReactionsInner = forwardRef(function ReactionsImpl(
  {
    reactions,
    unseenReactionsUnicode,
    onDeleteReaction,
    onAddReaction,
    showAddReactionButton,
    showReactionList,
    className,
  }: ReactionsInnerPropsWithClassname,
  ref: React.Ref<HTMLDivElement>,
) {
  const viewerData = useViewerData();

  const showAddReactionTooltip = showAddReactionButton && !showReactionList;

  const handleAddReactionClick = useCallback(
    (unicodeReaction: string) => {
      if (reactions) {
        isViewerPreviouslyAddedReaction(
          viewerData?.id ?? '',
          reactions,
          unicodeReaction,
        )
          ? onDeleteReaction(unicodeReaction)
          : onAddReaction(unicodeReaction);
      }
    },
    [reactions, onAddReaction, onDeleteReaction, viewerData?.id],
  );

  const addReactionElement = showAddReactionTooltip ? (
    <WithTooltip tooltip={<AddReactionsButtonTooltip />}>
      <AddReactionButton disabled={false} canBeReplaced />
    </WithTooltip>
  ) : (
    <AddReactionButton disabled={false} canBeReplaced />
  );

  const { EmojiPicker } = useEmojiPicker(
    addReactionElement,
    handleAddReactionClick,
  );

  const usersByReaction = useUsersByReactions(reactions);

  return (
    <div className={cx(classes.reactionsContainer, className)} ref={ref}>
      {showReactionList ? (
        <div className={classes.reactionList}>
          {Object.entries(usersByReaction).map(([unicodeReaction, users]) => (
            <ReactionPill
              key={unicodeReaction}
              unicodeReaction={unicodeReaction}
              users={users}
              unseen={unseenReactionsUnicode.includes(unicodeReaction)}
              onAddReaction={onAddReaction}
              onDeleteReaction={onDeleteReaction}
              isViewerReaction={isViewerPreviouslyAddedReaction(
                viewerData?.id ?? '',
                reactions,
                unicodeReaction,
              )}
            />
          ))}
          {showAddReactionButton && EmojiPicker}
        </div>
      ) : (
        showAddReactionButton && EmojiPicker
      )}
    </div>
  );
});

function AddReactionsButtonTooltip() {
  const { t } = useCordTranslation('message');

  return <DefaultTooltip label={t('add_reaction_action')} />;
}
