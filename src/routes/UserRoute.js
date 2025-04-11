import express from 'express';
import { changePassword, deleteProfile, getProfile, login, resetPassword, signUp, updateProfile } from '../controllers/user/UserController.js';
import { isAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/updateProfile', isAuth, updateProfile);
router.post('/deleteProfile', isAuth, deleteProfile);
router.get('/getProfile', isAuth, getProfile);
router.post('/changePassword', isAuth, changePassword);
router.post('/resetPassword', isAuth, resetPassword);

export { router as UserRoute }