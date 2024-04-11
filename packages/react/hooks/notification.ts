import type {
  ClientNotificationData,
  NotificationSummary,
  ObserveNotificationDataOptions,
  ObserveNotificationSummaryOptions,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext.js';
import { useMemoObject } from './useMemoObject.js';
import { useNotificationCountsInternal } from './useNotificationSummaryInternal.js';

/**
 * This method allows you to observe the notification summary for the current
 * user, including live updates.
 *
  @example Overview
* ```javascript
* import { notification } from '@cord-sdk/react';
* const counts = notification.useNotificationCounts({
*       filter: {
*           metadata: { flavor: 'minty' },
*           location: { page: 'bookmarks' },
*           groupID: 'group123',
*        },
*     });
*
* return (
*   <div>
*      {!counts && "Loading..."}
*      {counts && (
*        <p>Unread notifications: {counts.unread}</p>
*       )}
*   </div>
*  );
* ```
* @param options
*
* @returns A reference number which can be passed to unobserveSummary
*  to stop observing notification summary information.
 */
export function useNotificationCounts(
  options?: ObserveNotificationSummaryOptions,
): NotificationSummary | null {
  const { sdk } = useCordContext('useNotificationCounts');
  const notificationSDK = sdk?.notification;

  return useNotificationCountsInternal(notificationSDK, false, options?.filter);
}

const emptyNotificationData: ClientNotificationData = {
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
 * const { notifications, loading, hasMore, fetchMore } = notification.useNotifications(
 *   filter: { metadata: { flavor: 'minty' } } },
 * );
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
 * @param options - Miscellaneous options. See below.
 *
 * @returns The hook will return an object containing the fields described under
 * "Available Data" above. The component will automatically re-render if any of
 * the data changes, i.e., this data is always "live".
 */
export function useNotifications(
  options?: ObserveNotificationDataOptions,
): ClientNotificationData {
  const [data, setData] = useState<ClientNotificationData | null>(null);

  const { sdk } = useCordContext('useNotifications');
  const notificationSDK = sdk?.notification;
  const optionsMemo = useMemoObject(options);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const key = notificationSDK.observeNotifications(setData, optionsMemo);

    return () => {
      notificationSDK.unobserveNotifications(key);
    };
  }, [notificationSDK, optionsMemo]);

  return data ?? emptyNotificationData;
}

// Old names for backwards compatibility
export { useNotifications as useData, useNotificationCounts as useSummary };
