import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';
import withCord from '../hoc/withCord.js';
import * as classes from '../../../components/helpers/Separator.classnames.js';

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement>;
export const Separator = withCord<SeparatorProps>(
  forwardRef(function Separator(
    { className, ...restProps }: SeparatorProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div
        {...restProps}
        ref={ref}
        className={cx(classes.separator, className)}
      />
    );
  }),
  'Separator',
);
