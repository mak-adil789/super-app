import express from 'express';
const router = express.Router();
import { generateChatResponse } from '../services/geminiClient.js';
import { extractTimetable } from '../controllers/ocrController.js';
import { verifyToken } from '../middleware/auth.js';

router.post('/chat', verifyToken, async (req, res) => {
  const { history, message } = req.body;
  // ... (content omitted for brevity)
});

router.post('/ocr', verifyToken, extractTimetable);

export default router;
