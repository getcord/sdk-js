import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import withCord from '../../experimental/components/hoc/withCord.js';
import { ToolbarLayout } from './ToolbarLayout.js';

export type ComposerLayoutProps = {
  textEditor: JSX.Element;
  attachments: JSX.Element | null;
  addMention: JSX.Element | null;
  addAttachment: JSX.Element | null;
  sendButton: JSX.Element | null;
  cancelButton: JSX.Element | null;
};
export const ComposerLayout = withCord<
  React.PropsWithChildren<ComposerLayoutProps>
>(
  forwardRef(function ComposerLayout(
    props: ComposerLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { addAttachment, addMention, sendButton, cancelButton } = props;
    const toolbarItems = useMemo(() => {
      return [
        { name: 'addMention', element: addMention },
        { name: 'addAttachment', element: addAttachment },
        { name: 'sendButton', element: sendButton },
        { name: 'cancelButton', element: cancelButton },
      ];
    }, [addMention, addAttachment, sendButton, cancelButton]);
    return (
      <div
        ref={ref}
        className="cord-component cord-composer cord-expanded"
        style={{
          backgroundColor: 'var(--cord-color-base, #FFFFFF)',
          border:
            'var(--cord-composer-border, 1px solid var(--cord-color-base-x-strong, #DADCE0))',
          borderRadius:
            'var(--cord-composer-border-radius, var(--cord-border-radius-medium, var(--cord-space-3xs, 4px)))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {props.textEditor}
        {props.attachments}

        <ToolbarLayout canBeReplaced items={toolbarItems} />
      </div>
    );
  }),
  'ComposerLayout',
);
