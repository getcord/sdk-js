import React, { forwardRef, useMemo } from 'react';
import type { StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import withCord from '../../experimental/components/hoc/withCord.js';

export type InlineThreadLayoutProps = {
  topLevelMessage: JSX.Element | null;
  otherMessages: JSX.Element[];
  hideRepliesButton: JSX.Element;
  showRepliesButton: JSX.Element;
  toggleComposerButton: JSX.Element;
  composer: JSX.Element;
  isExpanded: boolean;
  showComposer: boolean;
  replyCount: number;
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineThreadLayout = withCord<
  React.PropsWithChildren<InlineThreadLayoutProps>
>(
  forwardRef(function InlineThreadLayout(
    props: InlineThreadLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      topLevelMessage,
      otherMessages,
      toggleComposerButton,
      hideRepliesButton,
      showRepliesButton,
      composer,
      isExpanded,
      replyCount,
      showComposer,
      ...restProps
    } = props;

    const toggleRepliesButton = useMemo(() => {
      if (replyCount <= 0) {
        return null;
      }

      if (isExpanded) {
        return hideRepliesButton;
      } else {
        return showRepliesButton;
      }
    }, [replyCount, isExpanded, hideRepliesButton, showRepliesButton]);

    const inlineComposer = useMemo(() => {
      if (!isExpanded) {
        return null;
      }

      if (showComposer) {
        return composer;
      } else {
        return toggleComposerButton;
      }
    }, [isExpanded, showComposer, composer, toggleComposerButton]);

    return (
      <div ref={ref} {...restProps}>
        {topLevelMessage}
        {toggleRepliesButton}
        {!isExpanded && replyCount === 0 && toggleComposerButton}
        {isExpanded && otherMessages}
        {inlineComposer}
      </div>
    );
  }),
  'InlineThreadLayout',
);
