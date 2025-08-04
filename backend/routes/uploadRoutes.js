import express from 'express';
import { upload, handleUpload } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload, handleUpload);

export default router;

