import React from 'react';
import { useSearchUsers } from '../../hooks/user.js';
import { useCordTranslation } from '../../index.js';
import { EmptyPlaceholder } from '../EmptyPlaceholder.js';

type EmptyThreadsPlaceholderProps = {
  groupID?: string;
  threads?: JSX.Element[];
};
export function EmptyThreadsPlaceholderWrapper({
  groupID,
  threads,
}: EmptyThreadsPlaceholderProps) {
  const { t } = useCordTranslation('threads');
  const placeholderUsers = useSearchUsers({
    groupID,
    skip: !groupID,
  });

  return (
    <EmptyPlaceholder
      type="threads-placeholder"
      users={placeholderUsers?.users ?? []}
      hidden={threads && threads.length > 0}
      title={t('placeholder_title')}
      body={t('placeholder_body')}
    />
  );
}
