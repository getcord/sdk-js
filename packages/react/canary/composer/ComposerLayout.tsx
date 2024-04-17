import * as React from 'react';
import { forwardRef, useMemo } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../../experimental/types.js';
import classes from '../composer/Composer.css.js';

import { ToolbarLayout } from './ToolbarLayout.js';

export type ComposerLayoutProps = {
  textEditor: JSX.Element;
  toolbarItems?: { name: string; element: JSX.Element | null }[];
  extraChildren?: { name: string; element: JSX.Element | null }[];
  isEmpty: boolean;
  isValid: boolean;
} & StyleProps;
export const ComposerLayout = withCord<
  React.PropsWithChildren<ComposerLayoutProps>
>(
  forwardRef(function ComposerLayout(
    props: ComposerLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      toolbarItems,
      extraChildren,
      className,
      isEmpty,
      isValid,
      textEditor: _,
      ...restProps
    } = props;
    const attachments = useMemo(
      () => extraChildren?.find((item) => item.name === 'attachments')?.element,
      [extraChildren],
    );

    const failedToSubmitMessage = useMemo(
      () =>
        extraChildren?.find((item) => item.name === 'failSubmitMessage')
          ?.element,
      [extraChildren],
    );

    const extra = useMemo(
      () =>
        extraChildren
          ?.filter(
            (item) =>
              item.name !== 'attachments' && item.name !== 'failSubmitMessage',
          )
          .map((item) => item.element),
      [extraChildren],
    );

    return (
      <>
        {failedToSubmitMessage}
        <div
          ref={ref}
          className={cx(
            classes.composerContainer,
            classes.expanded,
            className,
            {
              [classes.empty]: isEmpty,
              [classes.valid]: isValid,
            },
          )}
          {...restProps}
        >
          {props.textEditor}
          {attachments}

          <ToolbarLayout canBeReplaced items={toolbarItems} />
          {extra}
        </div>
      </>
    );
  }),
  'ComposerLayout',
);
