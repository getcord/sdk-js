import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types';
import withCord from '../../experimental/components/hoc/withCord.js';
import { ScrollContainer } from '../ScrollContainer.js';
import type { StyleProps } from '../../betaV2.js';
import classes from './Thread.css.js';

export type ThreadLayoutProps = {
  threadData: ClientThreadData | undefined;
  header: JSX.Element;
  messages: JSX.Element[];
  emptyThreadPlaceholder: JSX.Element;
  threadSeenBy: JSX.Element;
  composer: JSX.Element;
} & StyleProps;

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
        <ScrollContainer canBeReplaced>
          {[...messages, threadSeenBy]}
        </ScrollContainer>
        {(threadData === null ||
          (threadData !== undefined && !messages.length)) &&
          emptyThreadPlaceholder}
        {composer}
      </div>
    );
  }),
  'ThreadLayout',
);
