// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import cx from 'classnames';

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

// High Order Component (HOC) that adds a wrapper div.
export default function withWrapper<T extends Props>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string,
) {
  const displayName = componentName;

  const ComponentWithWrapper = React.forwardRef(
    (props: T, ref: React.ForwardedRef<HTMLDivElement>) => {
      const { className, ...restProps } = props;
      return (
        <div
          ref={ref}
          className={cx(
            'cord-component',
            `cord-component-${componentName}`,
            className,
          )}
          style={props.style}
        >
          <WrappedComponent {...(restProps as T)} />
        </div>
      );
    },
  );

  ComponentWithWrapper.displayName = `withWrapper(${displayName})`;

  return ComponentWithWrapper;
}
