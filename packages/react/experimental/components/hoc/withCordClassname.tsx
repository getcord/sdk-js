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
    (props: T, ref: React.ForwardedRef<HTMLElement>) => {
      const { className, ...restProps } = props;
      return (
        <WrappedComponent
          ref={ref}
          className={cx(className, {
            'cord-component': !className?.includes('cord-component'),
          })}
          {...(restProps as T)}
        />
      );
    },
  );

  ComponentWithCordClassname.displayName = `withCordClassname(${displayName})`;

  return ComponentWithCordClassname;
}
