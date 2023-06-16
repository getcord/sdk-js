import type { NotificationData, NotificationSummary } from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext';
import { useNotificationSummaryInternal } from './useNotificationSummaryInternal';

export function useSummary(): NotificationSummary | null {
  const { sdk } = useCordContext('useSummary');
  const notificationSDK = sdk?.notification;

  return useNotificationSummaryInternal(notificationSDK, false);
}

const emptyNotificationData: NotificationData = {
  notifications: [],
  loading: true,
  hasMore: false,
  fetchMore: async (_: number) => {},
};

export function useData(): NotificationData {
  const [data, setData] = useState<NotificationData | null>(null);

  const { sdk } = useCordContext('useData');
  const notificationSDK = sdk?.notification;

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const key = notificationSDK.observeData(setData);

    return () => {
      notificationSDK.unobserveData(key);
    };
  }, [notificationSDK]);

  return data ?? emptyNotificationData;
}
