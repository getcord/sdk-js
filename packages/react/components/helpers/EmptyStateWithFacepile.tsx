import * as React from 'react';
import cx from 'classnames';

import { Facepile } from '../Facepile';
import * as classes from './EmptyStateWithFacepile.css';

type Props = {
  users: string[];
  className?: string;
};

export function EmptyStateWithFacepile({ users, className }: Props) {
  return (
    <div className={cx(classes.emptyStatePlaceholderContainer, className)}>
      {users.length > 0 && <Facepile users={users} />}
      <p className={classes.emptyStatePlaceholderTitle}>
        {'Chat with your team, right here'}
      </p>
      <p className={classes.emptyStatePlaceholderBody}>
        {
          "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page."
        }
      </p>
    </div>
  );
}
