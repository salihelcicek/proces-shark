declare module 'deepseek-openai' {
  export interface ChatCompletionParams {
    messages: Array<{role: string; content: string}>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    [key: string]: unknown;
  }

  export interface ChatCompletionResponse {
    choices: Array<{
      message: {role: string; content: string};
      index: number;
    }>;
    created: number;
    model: string;
    [key: string]: unknown;
  }

  export class DeepSeekChat {
    constructor(options: { apiKey: string });
    
    async createChatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse>;
  }
} 