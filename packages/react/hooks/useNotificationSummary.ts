import { useEffect, useState } from 'react';
import type {
  ICordNotificationsSDK,
  NotificationSummary,
} from '@cord-sdk/types';

export function useNotificationSummary(
  notificationsSDK: ICordNotificationsSDK | undefined,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  useEffect(() => {
    if (!notificationsSDK) {
      return;
    }

    const listenerRef = notificationsSDK.observeNotificationSummary(setSummary);

    return () => {
      notificationsSDK.unobserveNotificationSummary(listenerRef);
    };
  }, [notificationsSDK]);

  return summary;
}
