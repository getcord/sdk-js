// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import cx from 'classnames';

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

// High Order Component (HOC) that adds '.cord-component' class.
export default function withCordClassname<T extends Props>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithCordClassname = React.forwardRef(
    (props: T, ref: React.ForwardedRef<HTMLDivElement>) => {
      const { className, ...restProps } = props;
      return (
        <WrappedComponent
          ref={ref}
          className={cx('cord-component', className)}
          {...(restProps as T)}
        />
      );
    },
  );

  ComponentWithCordClassname.displayName = `withCordClassname(${displayName})`;

  return ComponentWithCordClassname;
}
