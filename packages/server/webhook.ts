import { createHmac } from 'crypto';
import type {
  ThreadMessageAddedWebhookPayload,
  NotificationCreatedWebhookPayload,
  URLVerificationWebhookPayload,
} from '@cord-sdk/types';

export type WebhookPayload =
  | ThreadMessageAddedWebhookPayload
  | NotificationCreatedWebhookPayload
  | URLVerificationWebhookPayload;

export type WebhookRequest = {
  header(name: string): string;
  body: {
    type: string;
  };
};

/**
 * Will validate the signature of the webhook request to ensure the source of
 * the request is Cord, and can be trusted.  Will throw an exception if there
 * are any problems with the request validation.
 * @param requestPayload The raw request payload. The object must have a header
 * function that will fetch header properties for the request, and a body
 * property that is the raw payload from the webhook request. See the node express
 * request format for a compatible implementation. Note the body must be
 * the data from the raw request request payload, without performing JSON deserialization.
 * @param projectSecret The project secret.  This is used to validate the
 * request body using the cord signature proof.  Details can be found here:
 * https://docs.cord.com/reference/events-webhook
 */
export function validateWebhookSignature(
  requestPayload: WebhookRequest,
  projectSecret: string,
) {
  const cordTimestamp = Number(requestPayload.header('X-Cord-Timestamp'));
  const cordSignature = requestPayload.header('X-Cord-Signature');

  if (
    Number.isNaN(cordTimestamp) ||
    Math.abs(Date.now() - cordTimestamp) > 1000 * 60 * 5
  ) {
    throw new Error('Notification timestamp invalid or too old.');
  }
  const bodyString = JSON.stringify(requestPayload.body);
  const verifyStr = cordTimestamp + ':' + bodyString;
  const hmac = createHmac('sha256', projectSecret);
  hmac.update(verifyStr);
  const incomingSignature = hmac.digest('base64');

  if (cordSignature !== incomingSignature) {
    throw new Error('Unable to verify signature');
  }
}

/**
 * Will validate the signature of the webhook request to ensure the source of
 * the request is Cord, and can be trusted.  Will return false if there
 * are any problems with the request validation.
 * @param requestPayload The raw request payload. The object must have a header
 * function that will fetch header properties for the request, and a body
 * property that is the raw payload from the webhook request. See the node express
 * request format for a compatible implementation. Note the body must be
 * the data from the raw request request payload, without performing JSON deserialization.
 * @param projectSecret The project secret.  This is used to validate the
 * request body using the cord signature proof.  Details can be found here:
 * https://docs.cord.com/reference/events-webhook
 */
export function tryValidateWebhookSignature(
  requestPayload: WebhookRequest,
  clientSecret: string,
) {
  try {
    validateWebhookSignature(requestPayload, clientSecret);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * Takes a request payload, and returns a typed object for handling
 * Cord webhook notifications.
 * @param requestPayload Request payload from a webhook request. Should have
 * a similar structure to express style request object.
 * @returns A typed  object to support handling webhook events. See:
 * https://docs.cord.com/reference/events-webhook
 */
export function parseEventPayload(
  requestPayload: WebhookRequest,
): WebhookPayload {
  switch (requestPayload.body.type) {
    case 'thread-message-added':
      return requestPayload.body as unknown as ThreadMessageAddedWebhookPayload;
    case 'notification-created':
      return requestPayload.body as unknown as NotificationCreatedWebhookPayload;
    case 'url-verification':
      return requestPayload.body as unknown as URLVerificationWebhookPayload;
    default:
      throw 'unknown webhook request type.';
  }
}
