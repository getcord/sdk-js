import type { ListenerRef } from './core';

export type NotificationSummary = {
  unread: number;
};

export type NotificationSummaryUpdateCallback = (
  summary: NotificationSummary,
) => unknown;

export interface ICordNotificationSDK {
  observeSummary(
    callback: NotificationSummaryUpdateCallback,
    options?: Record<never, string>,
  ): ListenerRef;
  unobserveSummary(ref: ListenerRef): boolean;

  /**
   * @deprecated Renamed to observeSummary.
   */
  observeNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['observeSummary']>
  ): ReturnType<ICordNotificationSDK['observeSummary']>;

  /**
   * @deprecated Renamed to unobserveSummary.
   */
  unobserveNotificationSummary(
    ...args: Parameters<ICordNotificationSDK['unobserveSummary']>
  ): ReturnType<ICordNotificationSDK['unobserveSummary']>;
}
