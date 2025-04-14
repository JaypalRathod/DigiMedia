import Notification from "../../models/Notification.js";

const listAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });

        return success(res, 'All notifications retrieved successfully', notifications);
    } catch (err) {
        return fail(res, err.message);
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });

        return success(res, 'All notifications (for all users) marked as read');
    } catch (err) {
        return fail(res, err.message);
    }
};

const getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ isRead: false });

        return success(res, 'Unread notification count retrieved', { count });
    } catch (err) {
        return fail(res, err.message);
    }
};


const listUserNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        return success(res, 'Notifications retrieved successfully', notifications);
    } catch (err) {
        return fail(res, err.message);
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        await Notification.updateMany({ userId, isRead: false }, { isRead: true });

        return success(res, 'All notifications marked as read');
    } catch (err) {
        return fail(res, err.message);
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const deleted = await Notification.findOneAndDelete({ _id: id, userId });

        if (!deleted) return fail(res, 'Notification not found');

        return success(res, 'Notification deleted');
    } catch (err) {
        return fail(res, err.message);
    }
};


export {
    listAllNotifications,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    listUserNotifications,
    markAllAsRead,
    deleteNotification,
}