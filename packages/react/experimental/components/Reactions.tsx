import * as React from 'react';
import cx from 'classnames';

import { forwardRef, useCallback, useContext, useMemo } from 'react';
import type { ClientMessageData, Reaction } from '@cord-sdk/types/message.ts';
import type { ThreadSummary } from '@cord-sdk/types/thread.ts';
import {
  getUnseenReactions,
  isViewerPreviouslyAddedReaction,
} from '../../common/util.js';
import { useUsersByReactions } from '../../common/effects/useUsersByReactions.ts';
import { useMessage, useThread } from '../../hooks/thread.ts';
import { AddReactionButton } from './AddReactionButton.tsx';
import withCord from './hoc/withCord.js';
import { DefaultTooltip, WithTooltip } from './WithTooltip.tsx';
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

    if (!thread || !message) {
      return (
        <>
          {showAddReactionButton && (
            <AddReactionButton
              onDeleteReaction={() => {}}
              onAddReaction={() => {}}
              disabled={true}
              canBeReplaced
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
  const { sdk: cordSDK } = useContext(CordContext);
  const threadSDK = cordSDK?.thread;

  const onAddReaction = useCallback(
    (unicodeReaction: string) => {
      if (threadSDK && thread.id && message.id) {
        void threadSDK.updateMessage(thread.id, message.id, {
          addReactions: [unicodeReaction],
        });
      }
    },
    [message.id, thread.id, threadSDK],
  );

  const onDeleteReaction = useCallback(
    (unicodeReaction: string) => {
      if (threadSDK && thread.id && message.id) {
        void threadSDK.updateMessage(thread.id, message.id, {
          removeReactions: [unicodeReaction],
        });
      }
    },
    [message.id, thread.id, threadSDK],
  );

  const addReactionButton = useMemo(() => {
    return (
      <WithTooltip tooltip={<AddReactionsButtonTooltip />}>
        <AddReactionButton
          onAddReaction={onAddReaction}
          onDeleteReaction={onDeleteReaction}
          messageId={message.id}
        />
      </WithTooltip>
    );
  }, [message.id, onAddReaction, onDeleteReaction]);
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
