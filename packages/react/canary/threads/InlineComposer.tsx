import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';
import { useViewerData } from '../../hooks/user.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import { Avatar, SendComposer } from '../../betaV2.js';
import type { StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import { inlineComposer } from './Threads.classnames.js';

export type InlineComposerProps = {
  threadID: string;
  onCancel: () => void;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineComposer = withCord<
  React.PropsWithChildren<InlineComposerProps>
>(
  forwardRef(function InlineComposer(
    { className, onCancel, threadID, ...restProps }: InlineComposerProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const viewer = useViewerData();

    return (
      <div ref={ref} className={cx(inlineComposer, className)} {...restProps}>
        <Avatar user={viewer} canBeReplaced />
        <SendComposer
          canBeReplaced
          threadID={threadID}
          showCancelButton={!!onCancel}
          onCancel={onCancel}
          expanded="auto"
        />
      </div>
    );
  }),
  'InlineComposer',
);
