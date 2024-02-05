import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import type { ClientThreadData } from '@cord-sdk/types/thread.ts';
import withCord from '../experimental/components/hoc/withCord.tsx';
import { Button, OptionsMenu } from '../experimental.ts';
import { threadHeader } from '../components/Thread.classnames.ts';

export type ThreadProps = {
  thread?: ClientThreadData;
  showHeader?: boolean;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

export const Thread = withCord<React.PropsWithChildren<ThreadProps>>(
  forwardRef(function Thread({
    showHeader = false,
    thread,
    className,
    ...restProps
  }: ThreadProps) {
    return (
      <div {...restProps} className={cx(className, 'cord-component-thread')}>
        {showHeader && (
          <ThreadHeader
            canBeReplaced
            threadID={thread?.thread?.id}
            showContextMenu={true}
          />
        )}
      </div>
    );
  }),
  'Thread',
);

export type ThreadHeaderProps = {
  showContextMenu?: boolean;
  threadID: string | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export const ThreadHeader = withCord<ThreadHeaderProps>(
  forwardRef(function ThreadHeader(
    {
      threadID,
      showContextMenu = true,
      className,
      ...restProps
    }: ThreadHeaderProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    return (
      <div {...restProps} ref={ref} className={cx(className, threadHeader)}>
        {showContextMenu && threadID && (
          <OptionsMenu
            button={
              <Button
                canBeReplaced
                buttonAction="show-thread-options"
                icon="DotsThree"
              ></Button>
            }
            threadID={threadID}
            showThreadOptions={true}
            showMessageOptions={false}
            canBeReplaced
          />
        )}
        <Button
          canBeReplaced
          buttonAction="close-thread"
          icon="X"
          className="secondary-buttons"
        />
      </div>
    );
  }),
  'ThreadHeader',
);
