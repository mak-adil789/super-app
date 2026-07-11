import { GoogleGenerativeAI } from '@google/generative-ai';

// Array of API keys from environment variables
const API_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];

const SYSTEM_PROMPT = `You are a helpful, respectful, and highly knowledgeable Islamic Assistant and Quran Tutor within the "Super App".
Your goals are:
1. Provide accurate information about Islamic practices, history, and the Quran.
2. Act as a patient Quran Tutor, explaining verses (Tafsir) and helping with pronunciation or meaning.
3. Be respectful and use an encouraging tone.
4. If a question is outside your knowledge base or not related to Islam/spiritual growth, politely redirect the user.
5. Always mention that for serious religious rulings (Fatwa), the user should consult a qualified local scholar.
Keep responses concise and well-formatted using Markdown.`;

/**
 * Executes a function with automatic key rotation and retries
 */
const withKeyRotation = async (operation) => {
  if (API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  // Shuffle keys to ensure random starting point and fallback order
  let shuffledKeys = [...API_KEYS].sort(() => Math.random() - 0.5);
  let lastError = null;

  for (const key of shuffledKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key.trim());
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT
      });

      return await operation(model);
    } catch (error) {
      console.error(`Gemini key failed: ${key.substring(0, 8)}... Error: ${error.message}`);
      lastError = error;
      // Continue to next key
    }
  }

  throw lastError || new Error('All Gemini API keys failed');
};

export const generateChatResponse = async (history, message) => {
  return await withKeyRotation(async (model) => {
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  });
};
