import express from 'express';
import multer from 'multer';
import { updateUserProfile } from '../controllers/updateProfileController.js';
import {protect}  from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
 
const upload = multer({ storage });

// Route to update user profile
router.put('/updateprofile', protect, upload.single('userimg'), updateUserProfile);

export default router;
