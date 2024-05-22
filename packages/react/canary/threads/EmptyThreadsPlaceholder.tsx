import React, { useMemo } from 'react';
import type { ThreadsData } from '@cord-sdk/types';
import { useSearchUsers } from '../../hooks/user.js';
import { useCordTranslation } from '../../index.js';
import { EmptyPlaceholder } from '../EmptyPlaceholder.js';

type EmptyThreadsPlaceholderProps = {
  threadsData: ThreadsData;
  groupID?: string;
};
export function EmptyThreadsPlaceholderWrapper({
  groupID,
  threadsData,
}: EmptyThreadsPlaceholderProps) {
  const { t } = useCordTranslation('threads');
  const placeholderUsers = useSearchUsers({
    groupID,
    skip: !groupID,
  });

  const threads = useMemo(() => threadsData.threads, [threadsData.threads]);

  return (
    <EmptyPlaceholder
      type="threads-placeholder"
      users={placeholderUsers?.users ?? []}
      hidden={threadsData.loading || (threads && threads.length > 0)}
      title={t('placeholder_title')}
      body={t('placeholder_body')}
    />
  );
}
