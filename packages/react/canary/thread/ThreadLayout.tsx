import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import classes from './Thread.css.js';
import { ThreadScrollContainer } from './ThreadScrollContainer.js';

export type ThreadLayoutProps = {
  threadData: ClientThreadData | undefined;
  header: JSX.Element | null;
  messages: JSX.Element[];
  emptyThreadPlaceholder: JSX.Element;
  threadSeenBy: JSX.Element;
  composer: JSX.Element;
} & StyleProps &
  MandatoryReplaceableProps;

export const ThreadLayout = withCord<
  React.PropsWithChildren<ThreadLayoutProps>
>(
  forwardRef(function ThreadLayout(
    props: ThreadLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      composer,
      header,
      messages,
      threadData,
      emptyThreadPlaceholder,
      threadSeenBy,
      className,
      ...restProps
    } = props;

    return (
      <div
        {...restProps}
        className={cx(className, classes.thread)}
        ref={ref}
        data-cord-thread-id={threadData?.thread?.id}
      >
        {header}
        <ThreadScrollContainer
          fetchMore={threadData?.fetchMore}
          threadLoading={!!threadData?.loading}
          hasMore={threadData?.hasMore}
        >
          {[...messages, threadSeenBy]}
        </ThreadScrollContainer>
        {emptyThreadPlaceholder}
        {composer}
      </div>
    );
  }),
  'ThreadLayout',
);
