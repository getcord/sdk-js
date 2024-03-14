import * as React from 'react';
import cx from 'classnames';

import { forwardRef, useMemo } from 'react';
import type {
  ClientMessageData,
  Reaction,
  ThreadSummary,
} from '@cord-sdk/types';
import {
  getUnseenReactions,
  isViewerPreviouslyAddedReaction,
} from '../../common/util.js';
import { useUsersByReactions } from '../../common/effects/useUsersByReactions.js';
import { useMessage, useThread } from '../../hooks/thread.js';
import { useCordTranslation } from '../../index.js';
import * as classes from '../../components/Reactions.classnames.js';
import { useViewerData } from '../../hooks/user.js';
import {
  AddReactionToMessageButton,
  useAddRemoveReaction,
} from './ReactionPickButton.js';
import withCord from './hoc/withCord.js';
import { DefaultTooltip, WithTooltip } from './WithTooltip.js';
import { ReactionPill } from './message/ReactionPill.js';

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

    if (!thread || !message) {
      return (
        <>
          {showAddReactionButton && (
            <AddReactionToMessageButton
              threadID={threadId}
              messageID={messageId}
              disabled={true}
            />
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
        showAddReactionButton={showAddReactionButton}
        showReactionList={showReactionList}
        className={className}
        thread={thread}
        message={message}
      />
    );
  }),
  'Reactions',
);

export type ReactionsInnerProps = {
  reactions: Reaction[];
  unseenReactionsUnicode: string[];
  showAddReactionButton: boolean;
  showReactionList: boolean;
  thread: ThreadSummary;
  message: ClientMessageData;
} & React.HTMLAttributes<HTMLDivElement>;

type ReactionsInnerPropsWithClassname = ReactionsInnerProps & {
  className?: string;
};

const ReactionsInner = forwardRef(function ReactionsImpl(
  {
    reactions,
    unseenReactionsUnicode,
    showAddReactionButton,
    showReactionList,
    className,
    thread,
    message,
  }: ReactionsInnerPropsWithClassname,
  ref: React.Ref<HTMLDivElement>,
) {
  const viewerData = useViewerData();

  const usersByReaction = useUsersByReactions(reactions);
  const { onAddReaction, onDeleteReaction } = useAddRemoveReaction({
    threadID: thread.id,
    messageID: message.id,
  });

  const addReactionButton = useMemo(() => {
    return (
      <WithTooltip tooltip={<AddReactionsButtonTooltip />}>
        <AddReactionToMessageButton
          messageID={message.id}
          threadID={thread.id}
        />
      </WithTooltip>
    );
  }, [message.id, thread.id]);
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
          {showAddReactionButton && addReactionButton}
        </div>
      ) : (
        showAddReactionButton && addReactionButton
      )}
    </div>
  );
});

function AddReactionsButtonTooltip() {
  const { t } = useCordTranslation('message');

  return <DefaultTooltip label={t('add_reaction_action')} />;
}
