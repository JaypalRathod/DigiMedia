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
                android: { priority: "high" },
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


const sendPush = async (notificationObj) => {
    try {
        let { title, body, image, token, userId, userIds, data } = notificationObj;

        // Single user
        if (userId) {
            let userTokenObj = await FcmToken.findOne({ userId: ObjectId(userId) }).select({ token: 1 });
            if (userTokenObj) {
                token = userTokenObj.token;
            }
        }

        // Multiple users
        if (userIds) {
            const tokens = await FcmToken.find({
                userId: { $in: userIds.map(id => ObjectId(id)) },
            }).select("token");

            token = tokens.map(e => e.token);
        }

        if (token) {
            let response = await requestSendPush(title, body, image, token, data);
            return { success: true, message: "Success!", data: response };
        }

        return { success: false, message: "No token found" };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};


async function requestSendPush(title, body, image, token, data) {
    const notification = { title, body };
    if (image) notification.imageUrl = image;

    const message = {
        notification,
        android: { priority: "high" },
        apns: { headers: { "apns-priority": "10" } },
    };

    if (data) {
        message.data = {
            ...(data.msg ? { msg: JSON.stringify(data) } : { data: JSON.stringify(data) }),
        };
    }

    if (Array.isArray(token)) {
        message.tokens = token;
        const response = await admin.messaging().sendEachForMulticast(message);
        return response;
    } else {
        message.token = token;
        const response = await admin.messaging().send(message);
        return response;
    }
}


export { fcmToken, sendNotificationToUser, notificationAdd, sendPush };