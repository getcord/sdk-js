import * as React from 'react';
import cx from 'classnames';

import { useTranslation } from 'react-i18next';
import { Facepile } from '../Facepile';
import * as classes from './EmptyStateWithFacepile.css';

type Props = {
  users: string[];
  className?: string;
};

export function EmptyStateWithFacepile({ users, className }: Props) {
  const { t } = useTranslation('thread');
  return (
    <div className={cx(classes.emptyStatePlaceholderContainer, className)}>
      {users.length > 0 && <Facepile users={users} />}
      <p className={classes.emptyStatePlaceholderTitle}>
        {t('placeholder_title')}
      </p>
      <p className={classes.emptyStatePlaceholderBody}>
        {t('placeholder_body')}
      </p>
    </div>
  );
}
