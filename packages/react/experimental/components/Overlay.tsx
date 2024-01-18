import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import * as classes from '../../components/Overlay.css.ts';
import { Portal } from './Portal.tsx';
import withCord from './hoc/withCord.tsx';
import { imageModalOverlay } from '@cord-sdk/react/components/MediaModal.classnames.ts';

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
