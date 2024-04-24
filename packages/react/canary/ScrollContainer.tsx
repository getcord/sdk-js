import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';

import withCord from '../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../betaV2.js';
import { useComposedRefs } from '../common/lib/composeRefs.js';
import { debounce } from '../common/lib/debounce.js';
import type { MandatoryReplaceableProps } from '../experimental/components/replacements.js';
import * as classes from './ScrollContainer.css.js';

const SCROLL_THRESHOLD_PX = 16;

type Edge = 'top' | 'bottom' | 'none';
type AutoScrollToNewest = 'auto' | 'always' | 'never';
type AutoScrollDirection = 'top' | 'bottom';
export type ScrollContainerProps = {
  /**
   * The scroll container can auto scroll when new children are added.
   * The auto scroll direction informs the scroll container where
   * new children will be added.
   * @default "bottom"
   */
  autoScrollDirection?: AutoScrollDirection;
  /**
   * The scroll container can auto scroll when new children are added.
   * If `autoScrollToNewest` is set to `auto`, the scroll container will
   * scroll only if the user has scrolled to the edge, and the edge
   * matches `autoScrollDirection`. If not at an edge, the scroll is preserved.
   * `always` and `never` either _always_ scroll to the newest
   * child or _never_ do.
   * @default "auto"
   */
  autoScrollToNewest?: AutoScrollToNewest;
  onScrollToEdge?: (edge: Edge) => void;
  /**
   * Triggered when the children's height gets bigger
   * than the scroll container height.
   */
  onOverflowChange?: (hasOverflow: boolean) => void;
  children: JSX.Element[];
} & StyleProps &
  MandatoryReplaceableProps;

export const ScrollContainer = withCord<
  React.PropsWithChildren<ScrollContainerProps>
>(
  React.forwardRef(function ScrollContainer(
    {
      className,
      children,
      autoScrollDirection = 'bottom',
      autoScrollToNewest = 'auto',
      onScrollToEdge,
      onOverflowChange,
      ...rest
    }: ScrollContainerProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const combinedRefs = useComposedRefs<HTMLDivElement>(ref, containerRef);
    const edgeRef = useRef<Edge>(autoScrollDirection);
    const canScrollRef = useRef(false);

    // On scroll, check if we're at an edge.
    const handleScroll = useCallback(() => {
      if (!containerRef.current) {
        return;
      }

      const { current } = containerRef;
      const canScroll = checkCanScroll(current);
      if (!canScroll) {
        return;
      }

      const maybeEdge = getScrollEdge(current);
      const hasScrolledToNewEdge =
        maybeEdge !== 'none' && maybeEdge !== edgeRef.current;
      if (hasScrolledToNewEdge) {
        onScrollToEdge?.(maybeEdge);
      }
      edgeRef.current = maybeEdge;
    }, [onScrollToEdge]);
    const debouncedHandleScroll = useMemo(
      () => debounce(50, handleScroll),
      [handleScroll],
    );

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }
      const canScroll = checkCanScroll(containerRef.current);
      const overflowChanged = canScroll !== canScrollRef.current;
      if (overflowChanged) {
        onOverflowChange?.(canScroll);
      }
      canScrollRef.current = canScroll;
    }, [children.length, onOverflowChange]);

    // When new children are added/removed, handle the auto scroll
    useEffect(() => {
      if (!containerRef.current || autoScrollToNewest === 'never') {
        return;
      }

      const notAtEdge = edgeRef.current !== autoScrollDirection;
      if (autoScrollToNewest === 'auto' && notAtEdge) {
        return;
      }

      const { current } = containerRef;
      if (autoScrollDirection === 'bottom') {
        current.scrollTop = current.scrollHeight - current.clientHeight;
      } else if (autoScrollDirection === 'top') {
        current.scrollTop = 0;
      } // If not at an edge, browser will take care of scroll anchoring.
    }, [autoScrollToNewest, children.length, autoScrollDirection]);

    return (
      <div
        ref={combinedRefs}
        className={cx(className, classes.scrollContainer)}
        onScroll={debouncedHandleScroll}
        {...rest}
      >
        {children}
      </div>
    );
  }),
  'ScrollContainer',
);

function getScrollEdge(scrollContainer: HTMLDivElement): Edge {
  const { scrollTop, clientHeight, scrollHeight } = scrollContainer;

  const atTopEdge = scrollTop - SCROLL_THRESHOLD_PX <= 0;
  const atBottomEdge =
    clientHeight + scrollTop + SCROLL_THRESHOLD_PX >= scrollHeight;
  return atTopEdge ? 'top' : atBottomEdge ? 'bottom' : 'none';
}

function checkCanScroll(scrollContainer: HTMLDivElement) {
  const { clientHeight, scrollHeight } = scrollContainer;
  return clientHeight < scrollHeight;
}
