import type { NotificationSummary } from '@cord-sdk/types';
import { useCordContext } from '../contexts/CordContext';
import { useNotificationSummary } from './useNotificationSummary';

export function useCordNotificationSummary(): NotificationSummary | null {
  const { sdk } = useCordContext('useCordNotificationSummary');
  const notificationsSDK = sdk?.notifications;

  return useNotificationSummary(notificationsSDK);
}
