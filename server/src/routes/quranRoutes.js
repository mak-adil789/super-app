import express from 'express';
const router = express.Router();
import * as quranController from '../controllers/quranController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/bookmarks', verifyToken, quranController.getBookmarks);
router.post('/bookmarks', verifyToken, quranController.addBookmark);
router.delete('/bookmarks/:id', verifyToken, quranController.removeBookmark);

router.get('/progress', verifyToken, quranController.getProgress);
router.post('/progress', verifyToken, quranController.updateProgress);

export default router;
