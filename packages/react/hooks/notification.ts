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

/**
 * This method allows you to observe the full notification data for the current
 * user, including live updates.
 *
 * @example Overview
 * ```javascript
 * import { notification } from '@cord-sdk/react';
 * const { notifications, loading, hasMore, fetchMore } = notification.useData();
 * return (
 *   <div>
 *     {notifications.map((notification) => (
 *       <div key={notification.id}>
 *         Got notification {notification.id}!
 *       </div>
 *     ))}
 *     {loading ? (
 *       <div>Loading...</div>
 *     ) : hasMore ? (
 *       <div onClick={() => fetchMore(10)}>Fetch 10 more</div>
 *     ) : null}
 *   </div>
 * );
 * ```
 *
 * @returns The hook will return an object containing the fields described under
 * "Available Data" above. The component will automatically re-render if any of
 * the data changes, i.e., this data is always "live".
 */
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
