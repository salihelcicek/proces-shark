import { DeepSeekChat } from 'deepseek-openai';

const deepseek = new DeepSeekChat({
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export default deepseek;
