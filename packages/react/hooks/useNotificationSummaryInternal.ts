import { useEffect, useState } from 'react';
import type {
  ICordNotificationSDK,
  NotificationListFilter,
  NotificationSummary,
} from '@cord-sdk/types';

export function useNotificationSummaryInternal(
  notificationSDK: ICordNotificationSDK | undefined,
  isCordInternalCall: boolean,
  filter?: NotificationListFilter | undefined,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const listenerRef = notificationSDK.observeSummary(setSummary, {
      filter,
      ...{
        __cordInternal: isCordInternalCall,
      },
    });

    return () => {
      notificationSDK.unobserveSummary(listenerRef);
    };
  }, [notificationSDK, isCordInternalCall, filter]);

  return summary;
}
