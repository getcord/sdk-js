import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import type { StyleProps } from '../../experimental/types.js';
import type { ToolbarLayoutWithClassName } from './ToolbarLayout.js';

export type ComposerLayoutProps = {
  /**
   * Where your user inputs the text.
   */
  textEditor: JSX.Element;
  /**
   * An array of named elements that would appear in the toolbar.
   * You can filter some out, or reorder, or add new custom buttons.
   *
   * They are usually passed into `props.ToolbarLayoutComp`.
   */
  toolbarItems?: { name: string; element: JSX.Element | null }[];
  /**
   * An array of named elements that would appear in the composer.
   * By default it contains the file attachments.
   */
  extraChildren?: { name: string; element: JSX.Element | null }[];
  /**
   * If the composer is empty.
   * An empty composer will show a placeholder.
   */
  isEmpty: boolean;
  /**
   * If the composer is valid, this will enable or disable the send button.
   */
  isValid: boolean;
  /**
   * The toolbar layout component, we pass `toolbarItems` to it.
   * It is here mostly for your convenience so you do not need to import it.
   */
  ToolbarLayoutComp: typeof ToolbarLayoutWithClassName;
  /**
   * A function that can be used to upload, and attach files to the composer
   * without using the add attachment button. This is useful, for example,
   * if you wanted to create your own gif integration.
   */
  attachFilesToComposer: (files: File[]) => Promise<void>;
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
