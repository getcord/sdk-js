import { useEffect, useState } from 'react';

import type { NotificationSummary } from '@cord-sdk/types';
import { useCordContext } from '../contexts/CordContext';

export function useCordNotificationSummary(): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);

  const { sdk } = useCordContext('useCordNotificationSummary');
  const notificationsSDK = sdk?.experimental.notifications;

  useEffect(() => {
    if (!notificationsSDK) {
      return;
    }
    const ref = notificationsSDK.observeNotificationSummary(setSummary);

    return () => {
      notificationsSDK.unobserveNotificationSummary(ref);
    };
  }, [notificationsSDK]);

  return summary;
}
