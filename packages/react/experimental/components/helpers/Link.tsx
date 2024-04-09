import * as React from 'react';
import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';
import classes from '../../../components/helpers/Link.css.js';

export type LinkProps = React.PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement>
>;
export const Link = forwardRef(function Link(
  { children, className, ...restProps }: LinkProps,
  ref: React.Ref<HTMLAnchorElement>,
) {
  return (
    <a ref={ref} className={cx(className, classes.anchor)} {...restProps}>
      {children}
    </a>
  );
});
