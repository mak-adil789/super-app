import express from 'express';
const router = express.Router();
import * as mosqueController from '../controllers/mosqueController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/nearby', verifyToken, mosqueController.getNearbyMosques);

export default router;
