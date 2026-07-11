import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];

const TIMETABLE_SCHEMA = {
  description: "A list of prayer times extracted from an image",
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string", description: "The date in DD-MM-YYYY format" },
          timings: {
            type: "object",
            properties: {
              Fajr: { type: "string", description: "Time in HH:mm format" },
              Dhuhr: { type: "string", description: "Time in HH:mm format" },
              Asr: { type: "string", description: "Time in HH:mm format" },
              Maghrib: { type: "string", description: "Time in HH:mm format" },
              Isha: { type: "string", description: "Time in HH:mm format" }
            }
          }
        }
      }
    }
  }
};

const withKeyRotation = async (operation) => {
  if (API_KEYS.length === 0) throw new Error('No Gemini API keys configured');
  let shuffledKeys = [...API_KEYS].sort(() => Math.random() - 0.5);
  let lastError = null;

  for (const key of shuffledKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key.trim());
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: TIMETABLE_SCHEMA,
        }
      });
      return await operation(model);
    } catch (error) {
      console.error(`Gemini OCR key failed: ${key.substring(0, 8)}... Error: ${error.message}`);
      lastError = error;
    }
  }
  throw lastError || new Error('All Gemini API keys failed');
};

export const extractTimetable = async (req, res) => {
  const { image } = req.body; // Base64 string

  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const result = await withKeyRotation(async (model) => {
      const prompt = "Extract all dates and prayer times from this timetable image. Ensure dates are in DD-MM-YYYY and times in HH:mm format.";
      const imagePart = {
        inlineData: {
          data: image,
          mimeType: "image/jpeg"
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      return JSON.parse(result.response.text());
    });

    res.json(result);
  } catch (error) {
    console.error('OCR Extraction Error:', error.message);
    res.status(500).json({ error: 'Failed to extract data from image. Please ensure the photo is clear.' });
  }
};
