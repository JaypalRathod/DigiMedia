import express from 'express';
import { deleteProfile, login, signUp, updateProfile } from '../controllers/user/UserController.js';
import { isAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/updateProfile', isAuth, updateProfile);
router.post('/deleteProfile', isAuth, deleteProfile);

export { router as UserRoute }