import { useEffect, useState } from 'react';
import type {
  ICordNotificationsSDK,
  NotificationSummary,
} from '@cord-sdk/types';

export function useNotificationSummary(
  notificationsSDK: ICordNotificationsSDK | undefined,
  isCordInternalCall: boolean,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  useEffect(() => {
    if (!notificationsSDK) {
      return;
    }

    const listenerRef = notificationsSDK.observeNotificationSummary(
      setSummary,
      { __cordInternal: isCordInternalCall },
    );

    return () => {
      notificationsSDK.unobserveNotificationSummary(listenerRef);
    };
  }, [notificationsSDK, isCordInternalCall]);

  return summary;
}
