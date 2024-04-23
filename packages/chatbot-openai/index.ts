import { OpenAI } from 'openai';
import { messageIsFromBot } from '@cord-sdk/chatbot-base';
import type { ChatBot } from '@cord-sdk/chatbot-base';
import type { CoreMessageData } from '@cord-sdk/types';

export function messageToOpenaiMessage(
  m: CoreMessageData,
): OpenAI.ChatCompletionMessageParam {
  return {
    role: messageIsFromBot(m) ? 'assistant' : 'user',
    content: m.plaintext,
  };
}

type CompletionParams = Omit<
  OpenAI.ChatCompletionCreateParamsStreaming,
  'stream'
>;

export function openaiCompletion(
  apiKey: string,
  getOpenaiMessages: (
    ...p: Parameters<ChatBot['getResponse']>
  ) =>
    | OpenAI.ChatCompletionMessageParam[]
    | Promise<OpenAI.ChatCompletionMessageParam[]>
    | CompletionParams
    | Promise<CompletionParams>,
): ChatBot['getResponse'] {
  const openai = new OpenAI({
    apiKey,
  });

  return async function* response(messages, thread) {
    const completionParamsOrMessages = await getOpenaiMessages(
      messages,
      thread,
    );

    const completionParams: CompletionParams = Array.isArray(
      completionParamsOrMessages,
    )
      ? {
          model: 'gpt-4-0613',
          messages: completionParamsOrMessages,
        }
      : completionParamsOrMessages;
    const stream = await openai.chat.completions.create({
      ...completionParams,
      stream: true,
    });

    // TODO: is this the right way to do this? Is it too "eager", do we have any
    // backpressure issues?
    for await (const chunk of stream) {
      yield chunk.choices[0].delta.content;
    }
  };
}

export function openaiSimpleAssistant(
  apiKey: string,
  systemPrompt: string,
): ChatBot['getResponse'] {
  return openaiCompletion(apiKey, (messages, _thread) => [
    { role: 'system', content: systemPrompt },
    ...messages.map(messageToOpenaiMessage),
  ]);
}
