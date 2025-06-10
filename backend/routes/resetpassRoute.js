import express from 'express';
import {sendcode, resetpassword}  from '../controllers/resetController.js'; 

const router = express.Router();

router.post('/sendcode', sendcode );
router.post('/resetpassword', resetpassword );


export default router;
