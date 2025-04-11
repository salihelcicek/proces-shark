// Mock implementation of DeepSeek client using OpenAI
import OpenAI from 'openai';

export class DeepSeekChat {
  constructor(options) {
    // Create an OpenAI client with the provided API key
    this.client = new OpenAI({
      apiKey: options.apiKey || process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true, // Allow client-side usage if needed
    });
  }

  async createChatCompletion(params) {
    try {
      // Map from DeepSeek parameters to OpenAI parameters
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use OpenAI model
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
      });

      // Transform response to match DeepSeek expected format
      return {
        choices: [{
          message: {
            role: response.choices[0]?.message?.role || 'assistant',
            content: response.choices[0]?.message?.content || '',
          },
          index: 0,
        }],
        created: Date.now(),
        model: response.model || 'gpt-3.5-turbo',
      };
    } catch (error) {
      console.error('Error in DeepSeek client:', error);
      throw error;
    }
  }
} 