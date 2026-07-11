import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

router.post('/sync', verifyToken, userController.syncUser);
router.get('/me', verifyToken, userController.getMe);

export default router;
