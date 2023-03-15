import { useEffect, useState } from 'react';
import type {
  ICordNotificationSDK,
  NotificationSummary,
} from '@cord-sdk/types';

export function useNotificationSummary(
  notificationSDK: ICordNotificationSDK | undefined,
  isCordInternalCall: boolean,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const listenerRef = notificationSDK.observeNotificationSummary(setSummary, {
      __cordInternal: isCordInternalCall,
    });

    return () => {
      notificationSDK.unobserveNotificationSummary(listenerRef);
    };
  }, [notificationSDK, isCordInternalCall]);

  return summary;
}
