import type {
  ClientNotificationData,
  NotificationSummary,
  ObserveNotificationDataOptions,
  ObserveNotificationSummaryOptions,
} from '@cord-sdk/types';
import { useEffect, useState } from 'react';
import { useCordContext } from '../contexts/CordContext.tsx';
import { useMemoObject } from './useMemoObject.ts';
import { useNotificationSummaryInternal } from './useNotificationSummaryInternal.ts';

/**
 * This method allows you to observe the notification summary for the current
 * user, including live updates.
 *
  @example Overview
* ```javascript
*   import { notification } from '@cord-sdk/react';
*   const summary = notification.useSummary({
*         filter: {
*             metadata: { flavor: 'minty'},
*             location: {page: 'bookmarks'} 
*             organizationID: 'org123',
*          },
*       });
*
*   return (
*     <div>
*        {!summary && "Loading..."}
*        {summary && (
*          <p>Unread notifications: {summary.unread}</p>
*         )}
*     </div>
*    );
* ```
* @param options
*
* @returns A reference number which can be passed to unobserveSummary
*  to stop observing notification summary information.
 */
export function useSummary(
  options?: ObserveNotificationSummaryOptions,
): NotificationSummary | null {
  const { sdk } = useCordContext('useSummary');
  const notificationSDK = sdk?.notification;

  return useNotificationSummaryInternal(
    notificationSDK,
    false,
    options?.filter,
  );
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
 * const { notifications, loading, hasMore, fetchMore } = notification.useData(
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
export function useData(
  options?: ObserveNotificationDataOptions,
): ClientNotificationData {
  const [data, setData] = useState<ClientNotificationData | null>(null);

  const { sdk } = useCordContext('useData');
  const notificationSDK = sdk?.notification;
  const optionsMemo = useMemoObject(options);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const key = notificationSDK.observeData(setData, optionsMemo);

    return () => {
      notificationSDK.unobserveData(key);
    };
  }, [notificationSDK, optionsMemo]);

  return data ?? emptyNotificationData;
}
