import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import * as classes from '../../components/Overlay.css';
import { Portal } from './Portal';
import withCord from './hoc/withCord';
import { imageModalOverlay } from '@cord-sdk/react/components/MediaModal.classnames';

export type OverlayProps = React.PropsWithChildren<
  React.HTMLProps<HTMLDivElement>
>;

export const Overlay = withCord(
  forwardRef(function Overlay(
    { children, className, ...restProps }: OverlayProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    return (
      // Top level Portal *must* specify a target.
      <Portal target={document.body}>
        <div
          className={cx(className, classes.overlay, imageModalOverlay)}
          ref={ref}
          {...restProps}
        >
          {children}
        </div>
      </Portal>
    );
  }),
  'Overlay',
);
