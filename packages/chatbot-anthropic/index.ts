import Anthropic from '@anthropic-ai/sdk';
import { messageIsFromBot } from '@cord-sdk/chatbot-base';
import type { Chatbot } from '@cord-sdk/chatbot-base';
import type { CoreMessageData } from '@cord-sdk/types';

export function messageToAnthropicMessage(
  m: CoreMessageData,
): Anthropic.MessageParam {
  return {
    role: messageIsFromBot(m) ? 'assistant' : 'user',
    content: m.plaintext,
  };
}

type MessageCreateParams = Omit<
  Anthropic.MessageCreateParamsStreaming,
  'stream'
>;

export function anthropicCompletion(
  apiKey: string,
  getAnthropicMessages: (
    ...p: Parameters<Chatbot['getResponse']>
  ) =>
    | Anthropic.MessageParam[]
    | Promise<Anthropic.MessageParam[]>
    | MessageCreateParams
    | Promise<MessageCreateParams>,
): Chatbot['getResponse'] {
  const anthropic = new Anthropic({ apiKey });

  return async function* resopnse(messages, thread) {
    const createParamsOrMessages = await getAnthropicMessages(messages, thread);

    const createParams: MessageCreateParams = Array.isArray(
      createParamsOrMessages,
    )
      ? {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: createParamsOrMessages,
        }
      : createParamsOrMessages;
    const stream = await anthropic.messages.create({
      ...createParams,
      stream: true,
    });

    for await (const messageStreamEvent of stream) {
      // TODO: do we need to handle other message types? This seems to work...
      if (messageStreamEvent.type === 'content_block_delta') {
        yield messageStreamEvent.delta.text;
      }
    }
  };
}

export function anthropicSimpleAssistant(
  apiKey: string,
  systemPrompt: string,
): Chatbot['getResponse'] {
  return anthropicCompletion(apiKey, (messages, _thread) => ({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(messageToAnthropicMessage),
  }));
}
