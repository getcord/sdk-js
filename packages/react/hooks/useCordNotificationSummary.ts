import type { NotificationSummary } from '@cord-sdk/types';
import { useCordContext } from '../contexts/CordContext';
import { useNotificationSummary } from './useNotificationSummary';

export function useCordNotificationSummary(): NotificationSummary | null {
  const { sdk } = useCordContext('useCordNotificationSummary');
  const notificationSDK = sdk?.notification;

  return useNotificationSummary(notificationSDK, false);
}
