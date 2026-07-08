import express from 'express';
const router = express.Router();
import * as zakatController from '../controllers/zakatController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/nisab', verifyToken, zakatController.getNisabPrices);
router.post('/generate-report', verifyToken, zakatController.generateReport);

export default router;
