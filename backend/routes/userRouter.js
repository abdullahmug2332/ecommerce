import express from 'express';
import { getUserById,getAllUsers,deleteUserById } from '../controllers/userController.js';

const router = express.Router();

router.post('/getuser', getUserById);
router.get('/getalluser', getAllUsers);
router.delete('/deleteuser/:id', deleteUserById);

export default router;
