import * as React from 'react';
import cx from 'classnames';
import type {
  ThreadSummary,
  ClientThreadData,
  ComposerWebComponentEvents,
  EntityMetadata,
  Location,
  MessageInfo,
  ResolvedStatus,
  SortBy,
  ThreadListFilter,
} from '@cord-sdk/types';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logComponentInstantiation } from '../common/util';
import * as user from '../hooks/user';
import * as thread from '../hooks/thread';
import { useExtraClassnames } from '../hooks/useExtraClassnames';
import * as fonts from '../common/ui/atomicClasses/fonts.css';
import { MODIFIERS } from '../common/ui/modifiers';
import { useCallFunctionOnce } from '../common/effects/useCallFunctionOnce';
import { CordContext } from '../contexts/CordContext';
import type { ThreadListReactComponentProps } from './ThreadList';
import classes from './ThreadedComments.css';
import { Composer } from './Composer';
import { Avatar } from './Avatar';
import { Facepile } from './Facepile';
import { Message } from './Message';
import { Icon } from './helpers/Icon';
import { EmptyStateWithFacepile } from './helpers/EmptyStateWithFacepile';

const THREADED_COMMENTS_COMPONENT_NAME = 'CORD-THREADED-COMMENTS';

type DisplayResolved =
  | 'interleaved'
  | 'sequentially'
  | 'tabbed'
  | 'resolvedOnly'
  | 'unresolvedOnly';
type ShowReplies =
  | 'initiallyCollapsed'
  | 'initiallyExpanded'
  | 'alwaysCollapsed';
type MessageOrder = 'newest_on_top' | 'newest_on_bottom';
type ScrollDirection = 'up' | 'down';
type ComposerPosition = 'top' | 'bottom' | 'none';
export type ThreadedCommentsReactComponentProps = {
  location: Location;
  groupId?: string;
  partialMatch?: boolean;
  filter?: ThreadListFilter;
  threadMetadata?: EntityMetadata;
  className?: string;
  /** @deprecated Use sortBy and scrollDirection instead. */
  messageOrder?: MessageOrder;
  sortBy?: SortBy;
  scrollDirection?: ScrollDirection;
  composerPosition?: ComposerPosition;
  threadUrl?: string;
  threadName?: string;
  topLevelComposerExpanded?: boolean;
  replyComposerExpanded?: boolean;
  showReplies?: ShowReplies;
  highlightThreadId?: string;
  displayResolved?: DisplayResolved;
  autofocus?: boolean;
  enableFacepileTooltip?: boolean;
  showPlaceholder?: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
  onThreadResolve?: ThreadListReactComponentProps['onThreadResolve'];
  onThreadReopen?: ThreadListReactComponentProps['onThreadReopen'];
  onRender?: () => unknown;
  onLoading?: () => unknown;
  onComposerFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onComposerBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
  onComposerClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
};

export function ThreadedComments({
  className,
  location,
  groupId: propGroupID,
  messageOrder = 'newest_on_bottom',
  sortBy = 'first_message_timestamp',
  scrollDirection,
  composerPosition = 'bottom',
  threadUrl,
  threadName,
  topLevelComposerExpanded = false,
  replyComposerExpanded = false,
  showReplies = 'initiallyCollapsed',
  highlightThreadId,
  partialMatch = false,
  filter,
  threadMetadata,
  displayResolved = 'unresolvedOnly',
  autofocus = false,
  enableFacepileTooltip = false,
  showPlaceholder = true,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
  onThreadResolve,
  onThreadReopen,
  onRender,
  onLoading,
  onComposerFocus,
  onComposerBlur,
  onComposerClose,
  onSend,
}: ThreadedCommentsReactComponentProps) {
  const [resolvedTabSelected, setResolvedTabSelected] = useState<boolean>(
    displayResolved === 'resolvedOnly',
  );
  const [expandResolved, setExpandResolved] = useState<boolean>(false);
  // We are using the following hook to make sure we get called back
  // when the CordSDK is initialized
  const { sdk: cordSDK } = useContext(CordContext);

  // TODO - add back errors about groupID

  const threadCounts = thread.useThreadCounts({
    filter: {
      ...filter,
      // We are going to deprecate the location and resolvedStatus from the filter parameter.
      // In the meantime, we don't want anyone specifying their value for this hook.
      // This hook needs to fetch information about the location regardless of
      // what the aforementioned two filter parameters are set to.
      ...{ location: { value: location, partialMatch } },
      ...{ resolvedStatus: 'any' },
    },
  });

  // We have intentionally left the scrollDirection prop without a default, so we
  // can be sure whether developers have set it or not. We always want the
  // scrollDirection to take precedence over the deprecated messageOrder now on,
  // until we completely remove it. But for developers already using it, we want
  // to convert it below.
  if (!scrollDirection) {
    switch (messageOrder) {
      case 'newest_on_top': {
        scrollDirection = 'down';
        break;
      }
      // If neither the messageOrder or scrollDirection are set, the default value
      // of scrollDirection will be based on the default value of the messageOrder prop,
      // which is "newest_on_bottom".
      case 'newest_on_bottom': {
        scrollDirection = 'up';
        break;
      }
      default: {
        const _: never = messageOrder;
        scrollDirection = 'up';
        break;
      }
    }
  }

  // The property for ThreadedComments does not correspond 1:1 with the underlying
  // `resolvedStatus` API filter. If we want to see resolved and unresolved threads
  // together, we want to fetch `resolvedStatus: any`. Otherwise we only want to
  // fetch threads with the `resolvedStatus` of the tab which is currently active.
  let resolvedStatus: ResolvedStatus;
  switch (displayResolved) {
    case 'interleaved': {
      resolvedStatus = 'any';
      break;
    }
    case 'tabbed': {
      resolvedStatus = resolvedTabSelected ? 'resolved' : 'unresolved';
      break;
    }
    case 'resolvedOnly': {
      resolvedStatus = 'resolved';
      break;
    }
    case 'unresolvedOnly': {
      resolvedStatus = 'unresolved';
      break;
    }
    // This option renders open and resolved threads as two panels in the
    // same page. Open threads first, resolved threads second. The order
    // is directly tied to the sorting. For example, if the newest thread
    // is on top, the user will have to scroll to the bottom of the
    // ThreadedComments to view resolved threads.
    case 'sequentially': {
      resolvedStatus = 'unresolved';
      break;
    }
    default: {
      const _: never = displayResolved;
      resolvedStatus = 'any';
      break;
    }
  }
  const showResolvedInSamePage = displayResolved === 'sequentially';
  const locationHasResolvedThreads =
    !!threadCounts && threadCounts.resolved > 0;
  const composerOnTop = composerPosition === 'top';
  // When showing resolved threads only, we don't want to show the composer
  // since it does not make sense to create a new thread which is resolved.
  const showComposer =
    composerPosition !== 'none' && resolvedStatus !== 'resolved';
  const composer = (
    <Composer
      location={location}
      showExpanded={topLevelComposerExpanded}
      threadUrl={threadUrl}
      threadName={threadName}
      threadMetadata={threadMetadata}
      onFocus={onComposerFocus}
      onBlur={onComposerBlur}
      onSend={onSend}
      autofocus={autofocus}
      groupId={propGroupID}
    />
  );

  const resolvedStatusTabs = displayResolved === 'tabbed' && (
    <ResolvedStatusTabs
      showResolved={resolvedTabSelected}
      setShowResolved={setResolvedTabSelected}
    />
  );

  const newestOnTop = scrollDirection === 'down';

  const expandResolvedButton = showResolvedInSamePage &&
    locationHasResolvedThreads && (
      <ExpandResolvedButton
        key="expand_resolved_threads_button"
        isExpanded={expandResolved}
        onClick={() => setExpandResolved((prev) => !prev)}
        expandedArrow={
          newestOnTop ? <Icon name="UpSolid" /> : <Icon name="DownSolid" />
        }
        collapsedArrow={
          newestOnTop ? <Icon name="DownSolid" /> : <Icon name="UpSolid" />
        }
      />
    );

  const threadList = (
    <ThreadedCommentsThreadList
      key="main_list"
      groupId={propGroupID}
      location={location}
      partialMatch={partialMatch}
      filter={filter}
      resolvedStatus={
        filter?.resolvedStatus ? filter?.resolvedStatus : resolvedStatus
      }
      sortBy={sortBy}
      scrollDirection={scrollDirection}
      showReplies={showReplies}
      replyComposerExpanded={replyComposerExpanded}
      highlightThreadId={highlightThreadId}
      enableFacepileTooltip={enableFacepileTooltip}
      showPlaceholder={showPlaceholder}
      onRender={onRender}
      onLoading={onLoading}
      onMessageClick={onMessageClick}
      onMessageMouseEnter={onMessageMouseEnter}
      onMessageMouseLeave={onMessageMouseLeave}
      onMessageEditStart={onMessageEditStart}
      onMessageEditEnd={onMessageEditEnd}
      onThreadResolve={onThreadResolve}
      onThreadReopen={onThreadReopen}
      onComposerFocus={onComposerFocus}
      onComposerBlur={onComposerBlur}
      onComposerClose={onComposerClose}
      onSend={onSend}
    />
  );
  const resolvedThreadList = showResolvedInSamePage && expandResolved && (
    <ThreadedCommentsThreadList
      key="resolved_list"
      location={location}
      partialMatch={partialMatch}
      filter={filter}
      resolvedStatus={'resolved'}
      sortBy={sortBy}
      scrollDirection={scrollDirection}
      showReplies={showReplies}
      enableFacepileTooltip={enableFacepileTooltip}
      showPlaceholder={showPlaceholder}
      onMessageClick={onMessageClick}
      onMessageMouseEnter={onMessageMouseEnter}
      onMessageMouseLeave={onMessageMouseLeave}
      onThreadResolve={onThreadResolve}
      onThreadReopen={onThreadReopen}
    />
  );

  // When displayResolved is set to `sequentially` we display: unresolved threads,
  // a button to trigger the showing of resolved threads and the resolved threads.
  // The order is directly tied to the sort order of the messages, so we use an
  // array to be able to easily reverse how these components are displayed
  const threadListOrderedArray = [
    threadList,
    expandResolvedButton,
    resolvedThreadList,
  ];

  if (!cordSDK) {
    // We can't get translations until the SDK is initialized, so all the text
    // will just show the translation keys and look really weird.  Render
    // nothing instead.
    return null;
  }

  return (
    <div
      className={cx(classes.comments, className, {
        [classes.unresolvedOnly]: displayResolved === 'unresolvedOnly',
        [classes.resolvedOnly]: displayResolved === 'resolvedOnly',
      })}
    >
      {resolvedStatusTabs}
      {composerOnTop && showComposer && composer}
      <div className={classes.threadList}>
        {newestOnTop
          ? threadListOrderedArray
          : threadListOrderedArray.reverse()}
      </div>
      {!composerOnTop && showComposer && composer}
    </div>
  );
}

function ThreadedCommentsThreadList({
  location,
  partialMatch = false,
  groupId,
  filter,
  resolvedStatus,
  sortBy = 'first_message_timestamp',
  scrollDirection = 'up',
  replyComposerExpanded = false,
  showReplies = 'initiallyCollapsed',
  highlightThreadId,
  enableFacepileTooltip = false,
  showPlaceholder = true,
  onRender,
  onLoading,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
  onThreadResolve,
  onThreadReopen,
  onComposerFocus,
  onComposerBlur,
  onComposerClose,
  onSend,
}: {
  location: Location;
  partialMatch?: boolean;
  groupId?: string;
  filter?: ThreadListFilter;
  resolvedStatus?: ResolvedStatus;
  threadMetadata?: EntityMetadata;
  sortBy?: SortBy;
  scrollDirection?: ScrollDirection;
  composerPosition?: ComposerPosition;
  threadUrl?: string;
  threadName?: string;
  topLevelComposerExpanded?: boolean;
  replyComposerExpanded?: boolean;
  showReplies?: ShowReplies;
  highlightThreadId?: string;
  autofocus?: boolean;
  enableFacepileTooltip?: boolean;
  showPlaceholder?: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
  onThreadResolve?: ThreadListReactComponentProps['onThreadResolve'];
  onThreadReopen?: ThreadListReactComponentProps['onThreadReopen'];
  onRender?: () => unknown;
  onLoading?: () => unknown;
  onComposerFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onComposerBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
  onComposerClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
}) {
  const { threads, hasMore, loading, fetchMore } = thread.useLocationData(
    location,
    {
      sortBy,
      sortDirection: 'descending',
      partialMatch,
      filter: {
        ...filter,
        resolvedStatus,
      },
    },
  );

  // If groupId is not passed as a prop, this will be undefined.  If the user has
  // an org in their token the method will find and use that, so it will still work.
  const { groupMembers } = user.useGroupMembers({ groupID: groupId });
  const { t } = useTranslation('threaded_comments');

  const dispatchLoadingEvent = useCallFunctionOnce(onLoading);
  const dispatchRenderEvent = useCallFunctionOnce(onRender);
  const dispatchLogComponentEvent = useCallFunctionOnce(
    logComponentInstantiation,
  );
  useEffect(() => {
    if (loading) {
      dispatchLoadingEvent();
    } else {
      dispatchRenderEvent();
      dispatchLogComponentEvent(THREADED_COMMENTS_COMPONENT_NAME);
    }
  }, [
    dispatchLoadingEvent,
    dispatchLogComponentEvent,
    dispatchRenderEvent,
    loading,
  ]);

  const renderedThreads = threads.map((oneThread) => (
    <CommentsThread
      key={oneThread.id}
      threadExtraClassnames={oneThread.extraClassnames}
      threadId={oneThread.id}
      showReplies={showReplies}
      highlightThreadId={highlightThreadId}
      enableFacepileTooltip={enableFacepileTooltip}
      replyComposerExpanded={replyComposerExpanded}
      onMessageClick={onMessageClick}
      onMessageMouseEnter={onMessageMouseEnter}
      onMessageMouseLeave={onMessageMouseLeave}
      onMessageEditStart={onMessageEditStart}
      onMessageEditEnd={onMessageEditEnd}
      onThreadResolve={onThreadResolve}
      onThreadReopen={onThreadReopen}
      onComposerFocus={onComposerFocus}
      onComposerBlur={onComposerBlur}
      onComposerClose={onComposerClose}
      onSend={onSend}
    />
  ));

  const newestOnTop = scrollDirection === 'down';
  if (!newestOnTop) {
    renderedThreads.reverse();
  }

  const fetchMoreButton =
    !loading && hasMore ? <FetchMoreButton fetchMore={fetchMore} /> : null;

  const titlePlaceholder =
    resolvedStatus === 'resolved'
      ? t('resolved_placeholder_title')
      : t('placeholder_title');
  const bodyPlaceholder =
    resolvedStatus === 'resolved'
      ? t('resolved_placeholder_body')
      : t('placeholder_body');

  return (
    <>
      {showPlaceholder && threads.length === 0 && !loading && (
        <EmptyStateWithFacepile
          users={groupMembers?.map((p) => p.id) ?? []}
          titlePlaceholder={titlePlaceholder}
          bodyPlaceholder={bodyPlaceholder}
        />
      )}
      {!newestOnTop && fetchMoreButton}
      {threads.length !== 0 && renderedThreads}
      {newestOnTop && fetchMoreButton}
    </>
  );
}

function ExpandResolvedButton({
  isExpanded,
  onClick,
  expandedArrow,
  collapsedArrow,
}: {
  isExpanded: boolean;
  onClick: () => void;
  expandedArrow: JSX.Element;
  collapsedArrow: JSX.Element;
}) {
  const { t } = useTranslation('threaded_comments');

  return (
    <button
      type="button"
      className={cx(classes.expandResolvedButton, fonts.fontSmall)}
      onClick={onClick}
    >
      {isExpanded
        ? t('hide_resolved_threads_action')
        : t('show_resolved_threads_action')}
      {isExpanded ? expandedArrow : collapsedArrow}
    </button>
  );
}

function FetchMoreButton({
  fetchMore,
}: {
  fetchMore: (howMany: number) => Promise<void>;
}) {
  const { t } = useTranslation('threaded_comments');
  return (
    <button
      className={cx(classes.showMore, fonts.fontSmall)}
      onClick={() => void fetchMore(5)}
      type="button"
    >
      {t('load_more_action')}
    </button>
  );
}

function ResolvedStatusTabs({
  showResolved,
  setShowResolved,
}: {
  showResolved: boolean;
  setShowResolved: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation('threaded_comments');
  return (
    <div className={classes.tabContainer}>
      <button
        type="button"
        className={cx(fonts.fontSmall, classes.tab, {
          [MODIFIERS.active]: !showResolved,
        })}
        onClick={() => setShowResolved(false)}
      >
        {t('show_unresolved')}
      </button>
      <button
        type="button"
        className={cx(fonts.fontSmall, classes.tab, {
          [MODIFIERS.active]: showResolved,
        })}
        onClick={() => setShowResolved(true)}
      >
        {t('show_resolved')}
      </button>
    </div>
  );
}

function CommentsThread({
  threadId,
  threadExtraClassnames,
  showReplies,
  highlightThreadId,
  enableFacepileTooltip,
  replyComposerExpanded,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
  onThreadResolve,
  onThreadReopen,
  onComposerFocus,
  onComposerBlur,
  onComposerClose,
  onSend,
}: {
  threadId: string;
  threadExtraClassnames: string | null;
  showReplies: ShowReplies;
  highlightThreadId?: string;
  enableFacepileTooltip: boolean;
  replyComposerExpanded?: boolean;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
  onThreadResolve?: ThreadListReactComponentProps['onThreadResolve'];
  onThreadReopen?: ThreadListReactComponentProps['onThreadReopen'];
  onComposerFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onComposerBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
  onComposerClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
}) {
  const threadData = thread.useThread(threadId);
  const allowReplies = showReplies !== 'alwaysCollapsed';
  const initiallyExpandedReplies = showReplies === 'initiallyExpanded';
  const [showingReplies, setShowingReplies] = useState<boolean>(
    initiallyExpandedReplies,
  );
  const [showingComposer, setShowingComposer] = useState<boolean>(false);

  const handleCollapsedRepliesClick = useCallback(() => {
    if (allowReplies) {
      setShowingReplies(true);
      // When we have initially expanded replies and a user collapses and
      // reopens a thread, we don't want to show a composer (as we would in initiallyCollapsed)
      // state. We want to show consistent behavior.
      setShowingComposer(!initiallyExpandedReplies);
    }
  }, [allowReplies, initiallyExpandedReplies]);

  const extraClassnames = useExtraClassnames(threadExtraClassnames);

  const threadSummary = threadData?.thread;
  if (!threadSummary || !threadSummary.firstMessage?.id) {
    return null;
  }
  const isResolved = threadSummary.resolved;
  const hasReplies = threadSummary.userMessages > 1;
  const showReplyComponent = allowReplies && (!hasReplies || showingReplies);

  return (
    <div
      className={cx(classes.thread, extraClassnames, {
        [MODIFIERS.highlighted]: highlightThreadId === threadId,
        [MODIFIERS.resolved]: isResolved,
        [MODIFIERS.noReplies]: !hasReplies,
      })}
      data-cord-thread-id={threadId}
    >
      {isResolved && (
        <ResolvedThreadHeader
          threadId={threadId}
          threadSummary={threadSummary}
          onThreadReopen={onThreadReopen}
        />
      )}
      <Message
        messageId={threadSummary.firstMessage?.id}
        threadId={threadId}
        // Marking a single message as seen is not available just yet. When
        // we have a thread with no replies, we shouldn't be stuck in unread
        // state. If the message has replies, we can wait for the user to open
        // the replies to mark it as seen.
        markAsSeen={threadSummary.total === 1}
        onClick={onMessageClick}
        onMouseEnter={onMessageMouseEnter}
        onMouseLeave={onMessageMouseLeave}
        onEditStart={onMessageEditStart}
        onEditEnd={onMessageEditEnd}
        onThreadResolve={onThreadResolve}
        onThreadReopen={onThreadReopen}
      />

      {showingReplies &&
      // Don't show the expanded version until we actually have the thread data,
      // to prevent replacing the collapsed version with an empty div while the
      // thread data loads.
      (threadData.messages.length > 0 || !threadData.loading) ? (
        <ThreadReplies
          threadId={threadId}
          threadData={threadData}
          setShowingReplies={setShowingReplies}
          setShowingComposer={setShowingComposer}
          onMessageClick={onMessageClick}
          onMessageMouseEnter={onMessageMouseEnter}
          onMessageMouseLeave={onMessageMouseLeave}
          onMessageEditStart={onMessageEditStart}
          onMessageEditEnd={onMessageEditEnd}
        />
      ) : (
        <CollapsedReplies
          threadSummary={threadSummary}
          enableFacepileTooltip={enableFacepileTooltip}
          onClick={handleCollapsedRepliesClick}
        />
      )}
      {showReplyComponent && (
        <ReplyComponent
          threadId={threadId}
          showingComposer={showingComposer}
          replyComposerExpanded={replyComposerExpanded}
          setShowingComposer={setShowingComposer}
          setShowingReplies={setShowingReplies}
          onComposerFocus={onComposerFocus}
          onComposerBlur={onComposerBlur}
          onComposerClose={onComposerClose}
          onSend={onSend}
          onThreadReopen={(args) =>
            onThreadReopen?.({ threadID: args.threadId, thread: threadSummary })
          }
        />
      )}
    </div>
  );
}

function CollapsedReplies({
  threadSummary,
  enableFacepileTooltip,
  onClick,
}: {
  threadSummary: ThreadSummary;
  enableFacepileTooltip: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation('threaded_comments');
  // The thread summary has an unread count covering the entire thread. The UI we
  // render below looks like we are talking about the number of unread *replies*,
  // so if the first message itself is unread, subtract that from the number.
  // This prevents, for example, rendering "2 new replies" and then you click and
  // only one message appears (because the first message, already displayed, was
  // included in that count).
  let unreadNumber = threadSummary.unread;
  if (threadSummary.firstMessage && !threadSummary.firstMessage.seen) {
    unreadNumber--;
  }

  const hasUnread = unreadNumber > 0;
  // We are including only user messages in the reply count,
  // as it doesn't make sense to count action messages such as
  // "User X resolved this thread".
  // Then, the number of replies is one less than the total number of messages.
  const replyCount = threadSummary.userMessages - 1;
  const hasReplies = replyCount > 0;

  return (
    <>
      {hasReplies && (
        <button
          className={cx(classes.expandReplies, fonts.fontSmall, {
            [MODIFIERS.unseen]: hasUnread,
          })}
          onClick={onClick}
          type="button"
        >
          <Facepile
            users={threadSummary.repliers}
            enableTooltip={enableFacepileTooltip}
          />
          {hasUnread
            ? t('show_replies_action_unread', { count: unreadNumber })
            : t('show_replies_action_read', { count: replyCount })}
        </button>
      )}
    </>
  );
}

function ThreadReplies({
  threadId,
  threadData,
  setShowingReplies,
  setShowingComposer,
  onMessageClick,
  onMessageMouseEnter,
  onMessageMouseLeave,
  onMessageEditStart,
  onMessageEditEnd,
}: {
  threadId: string;
  threadData: ClientThreadData;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
  setShowingComposer: Dispatch<SetStateAction<boolean>>;
  onMessageClick?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseEnter?: (messageInfo: MessageInfo) => unknown;
  onMessageMouseLeave?: (messageInfo: MessageInfo) => unknown;
  onMessageEditStart?: (messageInfo: MessageInfo) => unknown;
  onMessageEditEnd?: (messageInfo: MessageInfo) => unknown;
}) {
  const { t } = useTranslation('threaded_comments');
  const { messages, hasMore, fetchMore } = threadData;

  // The useThreadData hook will also return the first message, but
  // since we are already rendering it, we need to remove it when
  // we receive it
  const restOfMessages = hasMore ? messages : messages.slice(1);

  const hasReplies = restOfMessages.length > 0;

  return (
    <>
      {hasReplies && (
        <>
          <button
            className={cx(classes.hideReplies, fonts.fontSmall)}
            onClick={() => {
              setShowingReplies(false);
              setShowingComposer(false);
            }}
            type="button"
          >
            {t('hide_replies_action')}
          </button>

          {hasMore && (
            <button
              className={cx(classes.showMore, fonts.fontSmall)}
              onClick={() => void fetchMore(5)}
              type="button"
            >
              {t('show_more_replies_action')}
            </button>
          )}
          <div className={classes.repliesContainer}>
            {restOfMessages.map((message) => {
              return (
                // We are not passing the onThreadResolve/onThreadReopen events
                // to the remaining messages, because we can only resolve/reopen
                // from the first message of a thread.
                <Message
                  key={message.id}
                  threadId={threadId}
                  messageId={message.id}
                  onClick={onMessageClick}
                  onMouseEnter={onMessageMouseEnter}
                  onMouseLeave={onMessageMouseLeave}
                  onEditStart={onMessageEditStart}
                  onEditEnd={onMessageEditEnd}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function ReplyComponent({
  threadId,
  showingComposer,
  replyComposerExpanded,
  setShowingComposer,
  setShowingReplies,
  onComposerFocus,
  onComposerBlur,
  onComposerClose,
  onSend,
  onThreadReopen,
}: {
  threadId: string;
  showingComposer: boolean;
  replyComposerExpanded?: boolean;
  setShowingComposer: Dispatch<SetStateAction<boolean>>;
  setShowingReplies: Dispatch<SetStateAction<boolean>>;
  onComposerFocus?: (...args: ComposerWebComponentEvents['focus']) => unknown;
  onComposerBlur?: (...args: ComposerWebComponentEvents['blur']) => unknown;
  onComposerClose?: (...args: ComposerWebComponentEvents['close']) => unknown;
  onSend?: (...args: ComposerWebComponentEvents['send']) => unknown;
  onThreadReopen?: (
    ...args: ComposerWebComponentEvents['threadreopen']
  ) => unknown;
}) {
  const { t } = useTranslation('threaded_comments');
  const viewerData = user.useViewerData();
  const userId = viewerData?.id;

  return showingComposer ? (
    <div className={classes.viewerAvatarWithComposer}>
      {userId && <Avatar userId={userId} />}
      <Composer
        threadId={threadId}
        showExpanded={replyComposerExpanded}
        showCloseButton
        size={'small'}
        autofocus
        onFocus={onComposerFocus}
        onBlur={onComposerBlur}
        onClose={(args) => {
          setShowingComposer(false);
          onComposerClose?.(args);
        }}
        onSend={onSend}
        onThreadReopen={onThreadReopen}
      />
    </div>
  ) : (
    <button
      className={cx(classes.expandReplies, fonts.fontSmall)}
      onClick={() => {
        setShowingComposer(true);
        setShowingReplies(true);
      }}
      type="button"
    >
      {t('reply_action')}
    </button>
  );
}

function ResolvedThreadHeader({
  threadId,
  threadSummary,
  onThreadReopen,
}: {
  threadId: string;
  threadSummary: ThreadSummary;
  onThreadReopen?: ThreadListReactComponentProps['onThreadReopen'];
}) {
  const { t } = useTranslation('threaded_comments');
  const setUnresolved = useCallback(() => {
    if (window.CordSDK) {
      void window.CordSDK.thread.updateThread(threadId, {
        resolved: false,
      });
    }
  }, [threadId]);
  return (
    <div className={cx(classes.resolvedThreadHeader, fonts.fontSmall)}>
      <Icon name={'CheckCircle'} />
      {t('resolved_status')}
      <button
        type="button"
        className={cx(classes.reopenButton, fonts.fontSmall)}
        onClick={() => {
          setUnresolved();
          onThreadReopen?.({ threadID: threadId, thread: threadSummary });
        }}
      >
        {t('unresolve_action')}
      </button>
    </div>
  );
}
