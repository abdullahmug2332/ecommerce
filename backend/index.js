import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js"
import Homeroute from "./routes/Homeroute.js"
import resetpass from "./routes/resetpassRoute.js"
import updateProfileRoute from "./routes/updateProfileRoute.js"
import addProductRoute from "./routes/addProductRoute.js"
import productRoutes from './routes/productRoutes.js';
import path from 'path';
import userRoutes from './routes/userRouter.js';
import fs from 'fs';
import db from './db.js';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/products', express.static(path.join(__dirname, 'products')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));


// Ensure uploads/products directory exists



app.use('/auth', authRoutes);
app.use("/",Homeroute);
app.use("/",resetpass);
app.use("/",updateProfileRoute) 
app.use("/",addProductRoute)
app.use('/', productRoutes);
app.use('/', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
