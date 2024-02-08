import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import * as classes from '../../components/Overlay.css.ts';
import { imageModalOverlay } from '../../components/MediaModal.classnames.ts';
import { Portal } from './Portal.tsx';
import withCord from './hoc/withCord.tsx';

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
