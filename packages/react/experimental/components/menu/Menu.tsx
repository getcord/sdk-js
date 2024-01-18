import * as React from 'react';
import { forwardRef, useCallback } from 'react';
import cx from 'classnames';
import withCord from '../hoc/withCord.tsx';
import * as classes from '../../../components/Menu.css.ts';

// We need more than just the `element`, so we can manipulate items more easily
// including filtering out items or adding more items
type MenuItem = {
  name: string;
  element: JSX.Element;
};

export type MenuProps = {
  items: MenuItem[];
} & React.HTMLAttributes<HTMLOListElement>;

export const Menu = withCord<React.PropsWithChildren<MenuProps>>(
  forwardRef(function Menu(
    { className, items, onClick, ...restProps }: MenuProps,
    ref: React.ForwardedRef<HTMLOListElement>,
  ) {
    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLOListElement>) => {
        event.stopPropagation();
        onClick?.(event);
      },
      [onClick],
    );

    return (
      <ol
        ref={ref}
        className={cx(classes.menu, className)}
        onClick={onClickHandler}
        {...restProps}
      >
        {items.map((item) => (
          <React.Fragment key={item.name}>{item.element}</React.Fragment>
        ))}
      </ol>
    );
  }),
  'Menu',
);
