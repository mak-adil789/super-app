import express from 'express';
const router = express.Router();
import * as familyController from '../controllers/familyController.js';
import { verifyToken } from '../middleware/auth.js';

router.post('/create', verifyToken, familyController.createFamily);
router.post('/join', verifyToken, familyController.joinFamily);
router.get('/data', verifyToken, familyController.getFamilyData);
router.post('/leave', verifyToken, familyController.leaveFamily);

export default router;
