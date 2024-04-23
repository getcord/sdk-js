import React, { useEffect, useState } from 'react';
import type { FetchMoreCallback } from '@cord-sdk/types';
import { ScrollContainer } from '../ScrollContainer.js';

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

export type ThreadScrollContainerProps = {
  fetchMore: FetchMoreCallback | undefined;
  threadLoading: boolean | undefined;
  children: JSX.Element[];
};

export const ThreadScrollContainer = (props: ThreadScrollContainerProps) => {
  const { fetchMore, threadLoading, children } = props;

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (shouldFetch && !threadLoading) {
      void fetchMore?.(NUMBER_OF_MESSAGES_TO_FETCH);
    }
  }, [fetchMore, shouldFetch, threadLoading]);

  return (
    <ScrollContainer
      canBeReplaced
      onScrollToEdge={(edge) => {
        if (edge === 'top') {
          void fetchMore?.(NUMBER_OF_MESSAGES_TO_FETCH);
        }
      }}
      onOverflowChange={(hasOverflow) => {
        setShouldFetch(!hasOverflow);
      }}
    >
      {children}
    </ScrollContainer>
  );
};
