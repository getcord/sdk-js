import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as composerClasses from '../../components/Composer.classnames.js';
import { composerToolbar } from './ToolbarLayout.css.js';

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
      <div ref={ref} className={composerToolbar}>
        <div className={composerClasses.secondaryButtonsGroup}>
          {secondaryButtons}
        </div>
        <div className={composerClasses.primaryButtonsGroup}>
          {primaryButtons}
        </div>
      </div>
    );
  }),
  'ToolbarLayout',
);
