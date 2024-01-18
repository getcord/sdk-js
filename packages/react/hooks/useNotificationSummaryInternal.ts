import { useEffect, useState } from 'react';
import type {
  ICordNotificationSDK,
  NotificationListFilter,
  NotificationSummary,
} from '@cord-sdk/types';
import { useMemoObject } from './useMemoObject.ts';

export function useNotificationSummaryInternal(
  notificationSDK: ICordNotificationSDK | undefined,
  isCordInternalCall: boolean,
  filter?: NotificationListFilter | undefined,
): NotificationSummary | null {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const filterMemo = useMemoObject(filter);

  useEffect(() => {
    if (!notificationSDK) {
      return;
    }

    const listenerRef = notificationSDK.observeSummary(setSummary, {
      filter: filterMemo,
      ...{
        __cordInternal: isCordInternalCall,
      },
    });

    return () => {
      notificationSDK.unobserveSummary(listenerRef);
    };
  }, [notificationSDK, isCordInternalCall, filterMemo]);

  return summary;
}
