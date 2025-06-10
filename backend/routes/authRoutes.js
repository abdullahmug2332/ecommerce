import express from 'express';
import { login, register, upload  } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register', upload.single('userimg'), register);
router.post('/login', login);

export default router;
