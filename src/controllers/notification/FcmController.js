import FcmToken from "../../models/FcmToken.js";
import Notification from "../../models/Notification.js";
import { fail, ObjectId, success } from "../../utils/helper.js";
import admin from "firebase-admin";

const fcmToken = async (req, res) => {
    try {
        const userId = req.userId;
        const { token, platform } = req.body;

        if (!token) {
            return fail(res, "FCM token is required");
        }

        const data = { token, platform, userId };

        const existing = await FcmToken.findOne({ userId });

        if (existing) {
            await FcmToken.findOneAndUpdate({ userId }, data, { new: true });
            return success(res, "FCM token updated successfully");
        } else {
            await FcmToken.create(data);
            return success(res, "FCM token created successfully");
        }
    } catch (error) {
        return fail(res, "server error: " + error.message);
    }
};

const sendNotificationToUser = async (userId, title, message, image) => {
    try {
        const userTokenObj = await FcmToken.findOne({ userId: ObjectId(userId) }).select({ token: 1 });

        if (userTokenObj?.token) {
            const messagePayload = {
                notification: {
                    title,
                    body: message,
                    ...(image && { imageUrl: image }),
                },
                token: userTokenObj.token,
            };

            const response = await admin.messaging().send(messagePayload);
            console.log("FCM notification sent:", response);
        } else {
            console.log("User does not have a valid FCM token.");
        }
    } catch (error) {
        console.error("Error sending FCM notification:", error);
    }
};

const notificationAdd = async (type, message, image, itemId, userId, sendFCM = true) => {
    try {
        const notificationObj = {
            type,
            title: message,
            image,
            itemId: ObjectId(itemId),
            userId: ObjectId(userId),
        };

        const notification = await Notification.create(notificationObj);

        if (sendFCM) {
            await sendNotificationToUser(userId, type, message, image);
        }

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Failed to create notification");
    }
};

export { fcmToken, sendNotificationToUser, notificationAdd };