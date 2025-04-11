import express from 'express';
import { imageUpload } from '../controllers/common/UploadController.js';
import { isAuth } from '../utils/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();


router.post('/imageUpload', isAuth, upload.array('image'), imageUpload);

export { router as CommonRoute }