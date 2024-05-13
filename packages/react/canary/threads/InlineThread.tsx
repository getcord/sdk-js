import * as React from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import type { ThreadSummary } from '@cord-sdk/types';
import cx from 'classnames';
import { Button, Message } from '../../betaV2.js';
import type { StyleProps } from '../../betaV2.js';
import { useThread } from '../../hooks/thread.js';
import { fontSmall } from '../../common/ui/atomicClasses/fonts.css.js';
import { useCordTranslation } from '../../index.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import classes from './Threads.css.js';
import { InlineThreadLayout } from './InlineThreadLayout.js';
import { InlineComposer } from './InlineComposer.js';
import { InlineReplyButton } from './InlineReplyButton.js';

export type InlineThreadWrapperProps = {
  thread: ThreadSummary;
};

export function InlineThreadWrapper({ thread }: InlineThreadWrapperProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const handleSetExpanded = useCallback((newExpanded: boolean) => {
    setExpanded(newExpanded);
  }, []);
  const handleSetShowComposer = useCallback((show: boolean) => {
    setShowComposer(show);
  }, []);

  return (
    <InlineThread
      thread={thread}
      setExpanded={handleSetExpanded}
      isExpanded={expanded}
      setShowComposer={handleSetShowComposer}
      showComposer={showComposer}
      canBeReplaced
    />
  );
}

export type InlineThreadProps = {
  thread: ThreadSummary;
  setExpanded?: (expanded: boolean) => void;
  isExpanded: boolean;
  setShowComposer?: (show: boolean) => void;
  showComposer: boolean;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineThread = withCord<
  React.PropsWithChildren<InlineThreadProps>
>(
  forwardRef(function InlineThread(
    {
      thread,
      isExpanded,
      showComposer,
      setExpanded,
      setShowComposer,
      className,
      ...restProps
    }: InlineThreadProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('thread_preview');

    const threadData = useThread(thread.id, {
      skip: !thread.id,
      initialFetchCount: 10, // TODO improve fetching strategy.
    });
    // We are including only user messages in the reply count,
    // as it doesn't make sense to count action messages such as
    // "User X resolved this thread".
    // Then, the number of replies is one less than the total number of messages
    // unless the first message is deleted in which case all user messages are replies
    const replyCount = useMemo(
      () =>
        thread.userMessages - (thread.firstMessage?.deletedTimestamp ? 0 : 1),

      [thread.firstMessage?.deletedTimestamp, thread.userMessages],
    );
    const allRepliersIDs = useMemo(
      () =>
        Array.from(
          new Set([...thread.repliers, ...thread.actionMessageRepliers]),
        ),
      [thread.actionMessageRepliers, thread.repliers],
    );

    const handleExpand = useCallback(() => {
      setShowComposer?.(true);
      setExpanded?.(true);
      void threadData.fetchMore(100); // TODO improve fetching strategy.
    }, [setExpanded, setShowComposer, threadData]);
    const handleHideInlineComposer = useCallback(
      () => setShowComposer?.(false),
      [setShowComposer],
    );

    return (
      <InlineThreadLayout
        className={cx(classes.inlineThread, className)}
        ref={ref}
        replyCount={replyCount}
        canBeReplaced
        isExpanded={isExpanded}
        showComposer={showComposer}
        topLevelMessage={
          thread.firstMessage && (
            <Message message={thread.firstMessage} showThreadOptions />
          )
        }
        otherMessages={threadData.messages.slice(1).map((m) => (
          <Message key={m.id} message={m} canBeReplaced />
        ))}
        composer={
          <InlineComposer
            threadID={thread.id}
            onCancel={handleHideInlineComposer}
            canBeReplaced
          />
        }
        toggleComposerButton={
          <Button
            buttonAction="add-reply"
            onClick={handleExpand}
            className={cx(classes.inlineReplyButton, fontSmall)}
            canBeReplaced
          >
            {t('reply_action')}
          </Button>
        }
        showRepliesButton={
          <InlineReplyButton
            canBeReplaced
            onClick={handleExpand}
            unreadCount={thread.unread}
            replyCount={replyCount}
            allRepliersIDs={allRepliersIDs}
          />
        }
        hideRepliesButton={
          <Button
            buttonAction="hide-replies"
            onClick={() => setExpanded?.(false)}
            className={cx(classes.inlineReplyButton, fontSmall)}
            canBeReplaced
          >
            {t('hide_replies_action')}
          </Button>
        }
        {...restProps}
      />
    );
  }),
  'InlineThread',
);
