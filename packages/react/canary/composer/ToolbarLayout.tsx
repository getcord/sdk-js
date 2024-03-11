import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import withCord from '../../experimental/components/hoc/withCord.js';

const PRIMARY = ['sendButton', 'cancelButton'];
export type ToolbarLayoutProps = {
  items?: { name: string; element: JSX.Element | null }[];
};
export const ToolbarLayout = withCord<
  React.PropsWithChildren<ToolbarLayoutProps>
>(
  forwardRef(function ComposerLayout(
    props: ToolbarLayoutProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const { items = [] } = props;

    const primaryButtons = useMemo(() => {
      return items
        .filter((item) => PRIMARY.includes(item.name))
        .map((item) => (
          <React.Fragment key={item.name}>{item.element}</React.Fragment>
        ));
    }, [items]);
    const secondaryButtons = useMemo(() => {
      return items
        .filter((item) => !PRIMARY.includes(item.name))
        .map((item) => (
          <React.Fragment key={item.name}>{item.element}</React.Fragment>
        ));
    }, [items]);

    return (
      <div
        ref={ref}
        className="cord-composer-menu"
        style={{
          borderTop: '1px solid var(--cord-color-base-x-strong, #DADCE0)',
          padding:
            'var(--cord-space-2xs, 8px) var(--cord-space-2xs, 8px) var(--cord-space-none, 0px)',
        }}
      >
        <div className="cord-composer-secondary-buttons">
          {secondaryButtons}
        </div>
        <div className="cord-composer-primary-buttons">{primaryButtons}</div>
      </div>
    );
  }),
  'ToolbarLayout',
);
