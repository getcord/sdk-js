import { useEffect, useState } from 'react';
import type {
  ICordNotificationSDK,
  NotificationSummary,
} from '@cord-sdk/types';

export function useNotificationSummaryInternal(
  notificationSDK: ICordNotificationSDK | undefined,
  isCordInternalCall: boolean,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const listenerRef = notificationSDK.observeSummary(setSummary, {
      __cordInternal: isCordInternalCall,
    });

    return () => {
      notificationSDK.unobserveSummary(listenerRef);
    };
  }, [notificationSDK, isCordInternalCall]);

  return summary;
}
