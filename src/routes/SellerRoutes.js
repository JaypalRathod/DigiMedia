import express from 'express';
import { isAuth } from '../utils/auth.js';
import { changeSellerPassword, deleteSellerProfile, getSellerProfile, sellerEmailVerify, sellerLogin, sellerResetPassword, sellerSendOtp, sellerSignUp, updateSellerProfile } from '../controllers/seller/SellerController.js';

const router = express.Router();

router.post('/login', sellerLogin);
router.post('/signUp', sellerSignUp);
router.post('/updateProfile', isAuth, updateSellerProfile);
router.post('/deleteProfile', isAuth, deleteSellerProfile);
router.get('/getProfile', isAuth, getSellerProfile);
router.post('/changePassword', isAuth, changeSellerPassword);
router.post('/sentOtp', sellerSendOtp);
router.post('/emailVerify', sellerEmailVerify);
router.post('/resetPassword', sellerResetPassword);

export { router as SellerRoute }