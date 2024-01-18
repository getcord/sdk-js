import * as React from 'react';
import cx from 'classnames';
import * as classes from '@cord-sdk/react/components/composer/BulletElement.classnames.ts';

type Props = {
  children: React.ReactNode;
} & (
  | {
      numberBullet: true;
      bulletNumber: number;
    }
  | {
      numberBullet?: false;
      bulletNumber?: undefined;
    }
);

export const BulletElement = ({
  children,
  numberBullet,
  bulletNumber,
}: Props) => {
  const listItem = (
    <li value={bulletNumber} className={classes.listItem}>
      {children}
    </li>
  );

  return (
    <>
      {numberBullet ? (
        <ol
          className={cx(classes.container, classes.orderedList)}
          style={{
            // Fix for "all: revert" CSS causing the list numbers to all be "1" in Firefox
            // despite having the right "value" prop on the <li>
            counterReset: `list-item ${bulletNumber - 1}`,
          }}
        >
          {listItem}
        </ol>
      ) : (
        <ul className={cx(classes.container, classes.unorderedList)}>
          {listItem}
        </ul>
      )}
    </>
  );
};
