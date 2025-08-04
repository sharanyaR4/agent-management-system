// routes/listRoutes.js
import express from 'express';
import { uploadCSV, getDistributedLists, getAgentItems } from '../controllers/listController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload and distribute file
router.post('/upload', protect, upload.single('file'), uploadCSV);

// Get all distributed lists
router.get('/distributions', protect, getDistributedLists);

// Get items for a specific agent
router.get('/agent/:agentId', protect, getAgentItems);

export default router;