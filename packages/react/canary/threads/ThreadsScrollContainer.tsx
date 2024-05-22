import React, { useEffect, useState } from 'react';
import type { FetchMoreCallback } from '@cord-sdk/types';
import { ScrollContainer } from '../ScrollContainer.js';

const NUMBER_OF_THREADS_TO_FETCH = 10;

export type ThreadsScrollContainerProps = {
  fetchMore: FetchMoreCallback;
  loading: boolean;
  hasMore: boolean;
  children?: React.ReactNode;
};

export const ThreadsScrollContainer = (props: ThreadsScrollContainerProps) => {
  const { fetchMore, loading, hasMore, children } = props;

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (shouldFetch && !loading && hasMore) {
      void fetchMore?.(NUMBER_OF_THREADS_TO_FETCH);
    }
  }, [fetchMore, shouldFetch, loading, hasMore]);

  return (
    <ScrollContainer
      canBeReplaced
      onScrollToEdge={(edge) => {
        if (edge === 'bottom' && hasMore) {
          void fetchMore?.(NUMBER_OF_THREADS_TO_FETCH);
        }
      }}
      onOverflowChange={(hasOverflow) => {
        setShouldFetch(!hasOverflow);
      }}
      autoScrollToNewest="never"
    >
      {children}
    </ScrollContainer>
  );
};
