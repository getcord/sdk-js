import React, { forwardRef } from 'react';
import type { StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import withCord from '../../experimental/components/hoc/withCord.js';

export type InlineThreadExpandedLayoutProps = {
  topLevelMessage: JSX.Element | null;
  otherMessages: JSX.Element[];
  hideRepliesButton: JSX.Element;
  composer: JSX.Element;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineThreadExpandedLayout = withCord<
  React.PropsWithChildren<InlineThreadExpandedLayoutProps>
>(
  forwardRef(function InlineThreadExpandedLayout(
    props: InlineThreadExpandedLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      topLevelMessage,
      otherMessages,
      hideRepliesButton,
      composer,
      ...restProps
    } = props;

    return (
      <div ref={ref} {...restProps}>
        {topLevelMessage}
        {hideRepliesButton}
        {otherMessages}
        {composer}
      </div>
    );
  }),
  'InlineThreadExpandedLayout',
);
