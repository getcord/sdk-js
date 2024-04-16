import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';
import { Button, OptionsMenu } from '../../experimental.js';
import type { StyleProps } from '../../experimental.js';
import classes from './Thread.css.js';

export type ThreadHeaderProps = {
  showContextMenu?: boolean;
  threadID: string | undefined;
} & StyleProps;

export const ThreadHeader = withCord<
  React.PropsWithChildren<ThreadHeaderProps>
>(
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
      <div
        {...restProps}
        ref={ref}
        className={cx(className, classes.threadHeader)}
      >
        {showContextMenu && threadID && (
          <OptionsMenu
            button={
              <Button
                canBeReplaced
                buttonAction="show-thread-options"
                icon="DotsThree"
                className={buttonClasses.colorsSecondary}
              ></Button>
            }
            threadID={threadID}
            showThreadOptions={true}
            showMessageOptions={false}
            canBeReplaced
            setEditing={() => {}}
          />
        )}
        <Button
          canBeReplaced
          buttonAction="close-thread"
          icon="X"
          className={buttonClasses.colorsSecondary}
        />
      </div>
    );
  }),
  'ThreadHeader',
);
