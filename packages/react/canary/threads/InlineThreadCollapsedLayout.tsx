import React, { forwardRef } from 'react';
import type { StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import withCord from '../../experimental/components/hoc/withCord.js';

export type InlineThreadCollapsedLayoutProps = {
  topLevelMessage: JSX.Element | null;
  showRepliesButton: JSX.Element;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineThreadCollapsedLayout = withCord<
  React.PropsWithChildren<InlineThreadCollapsedLayoutProps>
>(
  forwardRef(function InlineThreadCollapsedLayout(
    props: InlineThreadCollapsedLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { topLevelMessage, showRepliesButton, ...restProps } = props;

    return (
      <div ref={ref} {...restProps}>
        {topLevelMessage}
        {showRepliesButton}
      </div>
    );
  }),
  'InlineThreadCollapsedLayout',
);
