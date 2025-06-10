import express from 'express';
import { home } from '../controllers/home.js'; 
import {protect} from "../Middleware/authMiddleware.js"

const router = express.Router();

router.get('/',  home);


export default router;
