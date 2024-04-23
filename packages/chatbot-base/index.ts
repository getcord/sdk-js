import { fetchCordRESTApi, validateWebhookSignature } from '@cord-sdk/server';
import type {
  CoreMessageData,
  CoreThreadData,
  ServerUpdateUser,
  WebhookWrapperProperties,
} from '@cord-sdk/types';
import { isAsyncIterable, stringToMessageContent } from './private/util.js';

type MessageCreatedWebhookEvent =
  WebhookWrapperProperties<'thread-message-added'>;

export type ChatbotRegistry = {
  register: (botID: string, bot: Chatbot) => Promise<void>;
  forceRespond: (botID: string, threadID: string) => Promise<void>;
  webhookReceived: (req: Request) => Promise<boolean>;
};

export type Chatbot = {
  cordUser: ServerUpdateUser;
  shouldRespondToEvent: (
    event: MessageCreatedWebhookEvent,
  ) => boolean | Promise<boolean>;
  getResponse: (
    messages: CoreMessageData[],
    thread: CoreThreadData,
  ) =>
    | string
    | null
    | undefined
    // TODO: support MessageContent.
    | Promise<string | null | undefined>
    | AsyncIterable<string | null | undefined>;
  onResponseSent?: (
    response: CoreMessageData,
    messages: CoreMessageData[],
    thread: CoreThreadData,
  ) => void | Promise<void>;
};

const BOT_METADATA_KEY = '__chatBot';
export function eventIsFromBot(event: MessageCreatedWebhookEvent): boolean {
  return !!event.event.author.metadata[BOT_METADATA_KEY];
}
export function messageIsFromBot(message: CoreMessageData): boolean {
  return !!message.metadata[BOT_METADATA_KEY];
}

export function chatbots(
  project_id: string,
  project_secret: string,
): ChatbotRegistry {
  return new ChatbotRegistryImpl(project_id, project_secret);
}

class ChatbotRegistryImpl {
  #bots: Map<string, Chatbot> = new Map();
  #creds: { project_id: string; project_secret: string };

  constructor(project_id: string, project_secret: string) {
    this.#creds = { project_id, project_secret };
  }

  async register(botID: string, bot: Chatbot): Promise<void> {
    const cordUserWithMetadata: Chatbot['cordUser'] = {
      ...bot.cordUser,
      metadata: { [BOT_METADATA_KEY]: true, ...bot.cordUser.metadata },
    };
    await this.#fetch<unknown>(
      `v1/users/${botID}`,
      'PUT',
      cordUserWithMetadata,
    );
    this.#bots.set(botID, bot);
  }

  async forceRespond(botID: string, threadID: string): Promise<void> {
    // TODO: create thread if it doesn't already exist.
    const [thread, messages] = await Promise.all([
      this.#fetch<CoreThreadData>(`v1/threads/${threadID}`),
      this.#fetch<CoreMessageData[]>(
        `v1/threads/${threadID}/messages?sortDirection=ascending`,
      ),
    ]);

    await this.#doRespond(botID, messages, thread);
  }

  async webhookReceived(req: Request): Promise<boolean> {
    // Clone the request because we need the raw text here, and the json below,
    // and you can only use the body of a request once!
    await this.#validate(req.clone());

    const data: MessageCreatedWebhookEvent = await req.json();
    let type = '';
    if ('type' in data && typeof data.type === 'string') {
      type = data.type;
    }

    if (!type) {
      return false;
    }

    if (type === 'url-verification') {
      return true;
    }

    if (type !== 'thread-message-added') {
      return false;
    }

    const respondingBotIDs: string[] = [];
    await Promise.all(
      [...this.#bots.entries()].map(async ([botID, bot]) => {
        const shouldRespond = await bot.shouldRespondToEvent(data);
        if (shouldRespond) {
          respondingBotIDs.push(botID);
        }
      }),
    );

    if (respondingBotIDs.length > 0) {
      const thread: CoreThreadData = data.event.thread;
      const messages = await this.#fetch<CoreMessageData[]>(
        `v1/threads/${thread.id}/messages?sortDirection=ascending`,
      );

      await Promise.all(
        respondingBotIDs.map(
          async (botID) => await this.#doRespond(botID, messages, thread),
        ),
      );
    }

    return true;
  }

  async #doRespond(
    botID: string,
    messages: CoreMessageData[],
    thread: CoreThreadData,
  ) {
    await this.#fetch(`v1/groups/${thread.groupID}/members`, 'POST', {
      add: [botID],
    });

    const bot = this.#bots.get(botID);
    if (!bot) {
      throw new Error(`Invalid botID: ${botID}`);
    }

    let messageID: string;
    const response = await bot.getResponse(messages, thread);
    if (response === null || response === undefined) {
      return;
    } else if (typeof response === 'string') {
      ({ messageID } = await this.#fetch<{ messageID: string }>(
        `v1/threads/${thread.id}/messages`,
        'POST',
        {
          authorID: botID,
          content: stringToMessageContent(response),
          metadata: { [BOT_METADATA_KEY]: true },
        },
      ));
    } else if (isAsyncIterable(response)) {
      [{ messageID }] = await Promise.all([
        this.#fetch<{ messageID: string }>(
          `v1/threads/${thread.id}/messages`,
          'POST',
          {
            authorID: botID,
            content: [],
            metadata: { [BOT_METADATA_KEY]: true },
          },
        ),
        this.#typing(thread.id, botID, true),
      ]);

      // TODO: is this the right way to do this? Is it too "eager", do we have any
      // backpressure issues?
      // TODO: should we provide a way to cancel an ongoing answer if someone else
      // adds a message to the thread, or some other cancellation mechanism?
      let full = '';
      for await (const chunk of response) {
        if (chunk !== null && chunk !== undefined) {
          full += chunk;
        }

        await Promise.all([
          this.#typing(thread.id, botID, true),
          this.#fetch(`v1/threads/${thread.id}/messages/${messageID}`, 'PUT', {
            content: stringToMessageContent(full),
            updatedTimestamp: null,
          }),
        ]);
      }

      await this.#typing(thread.id, botID, false);
    } else {
      throw new Error('Unknown response type: ' + typeof response);
    }

    if (bot.onResponseSent) {
      const resopnseMessage = await this.#fetch<CoreMessageData>(
        `v1/threads/${thread.id}/messages/${messageID}`,
      );
      await bot.onResponseSent(resopnseMessage, messages, thread);
    }
  }

  async #fetch<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' = 'GET',
    body?: object,
  ): Promise<T> {
    return await fetchCordRESTApi<T>(endpoint, {
      ...this.#creds,
      method,
      body,
    });
  }

  async #typing(threadID: string, userID: string, present: boolean) {
    return await this.#fetch(`v1/threads/${threadID}`, 'PUT', {
      typing: present ? [userID] : [],
    });
  }

  async #validate(req: Request) {
    validateWebhookSignature(
      await req.text(),
      req.headers.get('X-Cord-Timestamp'),
      req.headers.get('X-Cord-Signature'),
      this.#creds.project_secret,
    );
  }
}
