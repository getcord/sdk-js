import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';

import withCord from '../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../experimental.js';
import { useComposedRefs } from '../common/lib/composeRefs.js';
import { debounce } from '../common/lib/debounce.js';
import * as classes from './ScrollContainer.css.js';

const SCROLL_THRESHOLD_PX = 16;

type Edge = 'top' | 'bottom' | 'none';
type AutoScrollToNewest = 'auto' | 'always' | 'never';
type AutoScrollDirection = 'top' | 'bottom';
export type ScrollContainerProps = {
  /**
   * Children added to this scroll container are appended at the bottom.
   * @default true
   */
  autoScrollDirection?: AutoScrollDirection;
  /**
   * If `auto`, the scroll is preserved unless the user
   * is at the edge where new child will appear.
   * `always` and `never` either _always_ scroll to the newest
   * child or never do.
   * @default "auto"
   */
  autoScrollToNewest?: AutoScrollToNewest;
  onScrollToEdge?: (edge: Edge) => void;
  children: JSX.Element[];
} & StyleProps;

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
      ...rest
    }: ScrollContainerProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const combinedRefs = useComposedRefs<HTMLDivElement>(ref, containerRef);
    const edgeRef = useRef<Edge>(autoScrollDirection);

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
      edgeRef.current = maybeEdge;

      if (maybeEdge !== 'none') {
        onScrollToEdge?.(maybeEdge);
      }
    }, [onScrollToEdge]);
    const debouncedHandleScroll = useMemo(
      () => debounce(50, handleScroll),
      [handleScroll],
    );

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
