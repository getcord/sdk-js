import type { NotificationSummary } from '@cord-sdk/types';
import { useCordContext } from '../contexts/CordContext';
import { useNotificationSummaryInternal } from './useNotificationSummaryInternal';

export function useSummary(): NotificationSummary | null {
  const { sdk } = useCordContext('useSummary');
  const notificationSDK = sdk?.notification;

  return useNotificationSummaryInternal(notificationSDK, false);
}
