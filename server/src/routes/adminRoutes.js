import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

// Apply protection to all admin routes
router.use(verifyToken, checkAdmin);

// Events
router.get('/events', adminController.getAllEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Lectures
router.get('/lectures', adminController.getAllLectures);
router.post('/lectures', adminController.createLecture);
router.put('/lectures/:id', adminController.updateLecture);
router.delete('/lectures/:id', adminController.deleteLecture);

// Duas
router.get('/duas', adminController.getAllDuas);
router.post('/duas', adminController.createDua);
router.put('/duas/:id', adminController.updateDua);
router.delete('/duas/:id', adminController.deleteDua);

export default router;
