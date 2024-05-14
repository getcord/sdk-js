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
import { MODIFIERS } from '../../common/ui/modifiers.js';
import classes from './Threads.css.js';
import { InlineThreadExpandedLayout } from './InlineThreadExpandedLayout.js';
import { InlineComposer } from './InlineComposer.js';
import { InlineReplyButton } from './InlineReplyButton.js';
import { InlineThreadCollapsedLayout } from './InlineThreadCollapsedLayout.js';

export type InlineThreadWrapperProps = {
  thread: ThreadSummary;
};

export function InlineThreadWrapper({ thread }: InlineThreadWrapperProps) {
  const [expanded, setExpanded] = useState(false);

  const handleSetExpanded = useCallback((newExpanded: boolean) => {
    setExpanded(newExpanded);
  }, []);

  return (
    <InlineThread
      thread={thread}
      setExpanded={handleSetExpanded}
      isExpanded={expanded}
      canBeReplaced
    />
  );
}

export type InlineThreadProps = {
  thread: ThreadSummary;
  setExpanded?: (expanded: boolean) => void;
  isExpanded: boolean;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineThread = withCord<
  React.PropsWithChildren<InlineThreadProps>
>(
  forwardRef(function InlineThread(
    {
      thread,
      isExpanded,
      setExpanded,
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
      setExpanded?.(true);
      void threadData.fetchMore(100); // TODO improve fetching strategy.
    }, [setExpanded, threadData]);

    if (isExpanded) {
      return (
        <InlineThreadExpandedLayout
          className={cx(classes.inlineThread, MODIFIERS.expanded, className)}
          ref={ref}
          canBeReplaced
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
              hidden={!isExpanded}
              threadID={thread.id}
              canBeReplaced
            />
          }
          hideRepliesButton={
            <Button
              buttonAction="collapse-inline-thread"
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
    }

    return (
      <InlineThreadCollapsedLayout
        className={cx(classes.inlineThread, MODIFIERS.collapsed, className)}
        ref={ref}
        canBeReplaced
        topLevelMessage={
          thread.firstMessage && (
            <Message
              message={thread.firstMessage}
              showThreadOptions
              canBeReplaced
            />
          )
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
        {...restProps}
      />
    );
  }),
  'InlineThread',
);
