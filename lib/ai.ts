import { DeepSeekChat } from '../lib/deepseek-openai';

const deepseek = new DeepSeekChat({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
});

export default deepseek;
