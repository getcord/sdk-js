import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../types.js';
import { ToolbarLayout } from './ToolbarLayout.js';

export type ComposerLayoutProps = {
  textEditor: JSX.Element;
  toolbarItems?: { name: string; element: JSX.Element | null }[];
  extraChildren?: { name: string; element: JSX.Element | null }[];
} & StyleProps;
export const ComposerLayout = withCord<
  React.PropsWithChildren<ComposerLayoutProps>
>(
  forwardRef(function ComposerLayout(
    props: ComposerLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { toolbarItems, extraChildren, className, style } = props;
    const attachments = useMemo(
      () => extraChildren?.find((item) => item.name === 'attachments')?.element,
      [extraChildren],
    );
    const extra = useMemo(
      () =>
        extraChildren
          ?.filter((item) => item.name !== 'attachments')
          .map((item) => item.element),
      [extraChildren],
    );
    return (
      <div
        ref={ref}
        className={cx(
          'cord-component',
          'cord-composer',
          'cord-expanded',
          className,
        )}
        style={
          style || {
            backgroundColor: 'var(--cord-color-base, #FFFFFF)',
            border:
              'var(--cord-composer-border, 1px solid var(--cord-color-base-x-strong, #DADCE0))',
            borderRadius:
              'var(--cord-composer-border-radius, var(--cord-border-radius-medium, var(--cord-space-3xs, 4px)))',
            display: 'flex',
            flexDirection: 'column',
          }
        }
      >
        {props.textEditor}
        {attachments}

        <ToolbarLayout canBeReplaced items={toolbarItems} />
        {extra}
      </div>
    );
  }),
  'ComposerLayout',
);
