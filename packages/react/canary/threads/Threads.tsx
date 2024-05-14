import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import type { ObserveThreadsOptions, ThreadSummary } from '@cord-sdk/types';
import cx from 'classnames';
import withCord from '../../experimental/components/hoc/withCord.js';
import { SendComposer } from '../../betaV2.js';
import type {
  ByOptions,
  StyleProps,
  WithByOptionsComponent,
} from '../../betaV2.js';

import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import { useThreads } from '../../hooks/thread.js';
import classes from './Threads.css.js';
import { ThreadsLayout } from './ThreadsLayout.js';
import type { ThreadsLayoutProps } from './ThreadsLayout.js';
import { InlineThreadWrapper } from './InlineThread.js';

interface CommonThreadsProps extends StyleProps {
  composerOptions?: {
    position: 'top' | 'bottom';
    groupID: string;
  };
}
interface ThreadsByOptionsProps extends CommonThreadsProps {
  options: ObserveThreadsOptions;
}
export interface ThreadsProps
  extends CommonThreadsProps,
    MandatoryReplaceableProps {
  threads: ThreadSummary[];
}

export const Threads: WithByOptionsComponent<
  ThreadsProps,
  ThreadsByOptionsProps
> = Object.assign(
  withCord<React.PropsWithChildren<ThreadsProps>>(
    forwardRef(function Threads(
      { threads, className, composerOptions, ...restProps }: ThreadsProps,
      ref: React.ForwardedRef<HTMLDivElement>,
    ) {
      const threadsToRender = useMemo(
        () =>
          threads
            .filter((t) => !!t.firstMessage)
            .map((t) => <InlineThreadWrapper key={t.id} thread={t} />),
        [threads],
      );

      const sendComposer: Partial<
        | Pick<ThreadsLayoutProps, 'footerChildren' | 'headerChildren'>
        | undefined
      > = useMemo(() => {
        if (!composerOptions) {
          return;
        }

        const composer = [
          {
            name: 'composer',
            element: (
              <SendComposer
                canBeReplaced
                createThread={{ groupID: composerOptions.groupID }}
              />
            ),
          },
        ];

        if (composerOptions.position === 'top') {
          return { headerChildren: composer };
        } else {
          return { footerChildren: composer };
        }
      }, [composerOptions]);

      return (
        <ThreadsLayout
          ref={ref}
          canBeReplaced
          threads={threadsToRender}
          className={cx(classes.threads, className)}
          {...sendComposer}
          {...restProps}
        />
      );
    }),
    'Threads',
  ),
  { ByOptions: ThreadsByOptions },
);

function ThreadsByOptions(props: ByOptions<ThreadsByOptionsProps>) {
  const { options, ...restProps } = props;
  const { threads } = useThreads(options);

  return <Threads threads={threads} {...restProps} canBeReplaced />;
}
