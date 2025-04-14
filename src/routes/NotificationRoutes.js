import express from 'express';
import { deleteNotification, getUnreadNotificationCount, listAllNotifications, listUserNotifications, markAllAsRead, markAllNotificationsAsRead } from '../controllers/notification/NotificationController.js';
import { isAuth } from '../utils/auth.js';
import { fcmToken } from '../controllers/notification/FcmController.js';

const router = express.Router();

router.post("/user/fcm/token", isAuth, fcmToken);

router.get('/user/notifications', isAuth, listUserNotifications);
router.put("/user/notifications/mark-all-read", isAuth, markAllAsRead);
router.get("/user/notifications/unread-count", isAuth, getUnreadNotificationCount);
router.delete("/user/notifications/:id", isAuth, deleteNotification);
router.get("/notifications", listAllNotifications);
router.put("/notifications/mark-all-read", markAllNotificationsAsRead);


export { router as NotificationRoute }