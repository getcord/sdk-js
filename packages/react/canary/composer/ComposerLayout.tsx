import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import type { StyleProps } from '../../experimental/types.js';
import type { ToolbarLayoutWithClassName } from './ToolbarLayout.js';

export type ComposerLayoutProps = {
  textEditor: JSX.Element;
  toolbarItems?: { name: string; element: JSX.Element | null }[];
  extraChildren?: { name: string; element: JSX.Element | null }[];
  isEmpty: boolean;
  isValid: boolean;
  ToolbarLayoutComp: typeof ToolbarLayoutWithClassName;
} & StyleProps &
  MandatoryReplaceableProps;
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
      ToolbarLayoutComp,
      textEditor: _textEditor,
      isEmpty: _isEmpty,
      isValid: _isValid,
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
        <div ref={ref} {...restProps}>
          {props.textEditor}
          {attachments}

          <ToolbarLayoutComp items={toolbarItems} />
          {extra}
        </div>
      </>
    );
  }),
  'ComposerLayout',
);
