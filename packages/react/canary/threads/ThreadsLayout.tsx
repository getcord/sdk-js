import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import withCord from '../../experimental/components/hoc/withCord.js';
import { ScrollContainer } from '../../betaV2.js';
import type { NamedElements, StyleProps } from '../../betaV2.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';

export type ThreadsLayoutProps = {
  threads: JSX.Element[];
  /**
   * An array of named elements, added at the bottom of Threads, outside
   * the scroll container.
   */
  footerChildren?: NamedElements;
  /**
   * An array of named elements, added at the top of Threads, outside
   * the scroll container.
   */
  headerChildren?: NamedElements;
} & StyleProps &
  MandatoryReplaceableProps;

export const ThreadsLayout = withCord<
  React.PropsWithChildren<ThreadsLayoutProps>
>(
  forwardRef(function ThreadsLayout(
    props: ThreadsLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { headerChildren, threads, footerChildren, ...restProps } = props;
    const header = useMemo(
      () =>
        headerChildren?.map(
          ({ element, name }) => ({ ...element, key: name }) as JSX.Element,
        ),
      [headerChildren],
    );
    const footer = useMemo(
      () =>
        footerChildren?.map(
          ({ element, name }) => ({ ...element, key: name }) as JSX.Element,
        ),
      [footerChildren],
    );

    return (
      <div {...restProps} ref={ref}>
        {header}
        <ScrollContainer autoScrollToNewest="never" canBeReplaced>
          {threads}
        </ScrollContainer>
        {footer}
      </div>
    );
  }),
  'ThreadsLayout',
);
