import express from 'express';
import { addProduct, uploadProductImg } from '../controllers/addProductController.js';

const router = express.Router();

router.post('/addproduct', uploadProductImg.single('image'), addProduct);

export default router;
