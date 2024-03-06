import { createHmac } from 'crypto';
import * as jwt from 'jsonwebtoken';
import type { ClientAuthTokenData } from '@cord-sdk/types';

export type { ClientAuthTokenData };

export type CommonAuthTokenOptions = {
  /**
   * How long until the token expires.  If not set, defaults to 1 minute.
   */
  expires?: jwt.SignOptions['expiresIn'];
};

export type GetClientAuthTokenOptions = CommonAuthTokenOptions;

export type GetServerAuthTokenOptions = CommonAuthTokenOptions;

export type GetApplicationManagementAuthTokenOptions = CommonAuthTokenOptions;

export type WebhookRequest = {
  header(name: string): string;
  body: string;
};

export function getClientAuthToken(
  project_id: string,
  project_secret: string,
  payload: Omit<ClientAuthTokenData, 'app_id' | 'project_id'>,
  options: GetClientAuthTokenOptions = {},
): string {
  if (!payload || !payload.user_id) {
    // You can't get here in TS -- it's a TS type error -- but not everyone uses
    // TS.
    throw new Error(
      'Missing user_id. ' +
        'A token without a user_id can be misinterpreted as an administrative server auth token ' +
        '(which should never be given to clients). ' +
        'If you intended to generate a server auth token, call getServerAuthToken instead.',
    );
  }

  return jwt.sign({ ...payload, project_id }, project_secret, {
    algorithm: 'HS512',
    expiresIn: options.expires ?? '1 min',
  });
}

export function getServerAuthToken(
  project_id: string,
  project_secret: string,
  options: GetServerAuthTokenOptions = {},
): string {
  return jwt.sign({ app_id: project_id }, project_secret, {
    algorithm: 'HS512',
    expiresIn: options.expires ?? '1 min',
  });
}

export function getApplicationManagementAuthToken(
  customer_id: string,
  customer_secret: string,
  options: GetApplicationManagementAuthTokenOptions = {},
): string {
  return jwt.sign({ customer_id }, customer_secret, {
    algorithm: 'HS512',
    expiresIn: options.expires ?? '1 min',
  });
}

export function getProjectManagementAuthToken(
  customer_id: string,
  customer_secret: string,
): string {
  return jwt.sign({ customer_id }, customer_secret, {
    algorithm: 'HS512',
    expiresIn: '1 min',
  });
}

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
