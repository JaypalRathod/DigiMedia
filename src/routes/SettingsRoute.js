import express from 'express';
import { isAuth } from '../utils/auth.js';
import { toggleProfileVisibility, togglePushNotifications } from '../controllers/setting/SettingsController.js';


const router = express.Router();

router.post('/toggle-profile-visibility', isAuth, toggleProfileVisibility);
router.post('/toggle-notification-push', isAuth, togglePushNotifications);

export { router as SettingsRoute }
