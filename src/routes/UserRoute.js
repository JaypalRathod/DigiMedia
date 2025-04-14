import express from 'express';
import { changePassword, deleteProfile, emailVerify, getProfile, login, resetPassword, sentOtp, signUp, updateProfile } from '../controllers/user/UserController.js';
import { isAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/updateProfile', isAuth, updateProfile);
router.post('/deleteProfile', isAuth, deleteProfile);
router.get('/getProfile', isAuth, getProfile);
router.post('/changePassword', isAuth, changePassword);
router.post('/sentOtp', sentOtp);
router.post('/emailVerify', emailVerify);
router.post('/resetPassword', resetPassword);

export { router as UserRoute }