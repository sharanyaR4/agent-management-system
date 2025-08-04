import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ KEEP ONLY THIS

import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent
} from '../controllers/agentController.js';

const router = express.Router();

router.get('/', protect, getAgents); 
router.post('/create', protect, createAgent);
router.put('/:id', protect, updateAgent);
router.delete('/:id', protect, deleteAgent);

export default router;




