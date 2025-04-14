import User from "../../models/UserModel.js";
import { fail, success } from "../../utils/helper.js";

const toggleProfileVisibility = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        user.isProfilePublic = !user.isProfilePublic;
        await user.save();

        return success(res, "Profile visibility updated", { isProfilePublic: user.isProfilePublic });
    } catch (err) {
        return fail(res, err.message);
    }
};

const togglePushNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        user.notification = !user.notification;
        await user.save();

        return success(res, "Push notification setting updated", { notification: user.notification });
    } catch (err) {
        return fail(res, err.message);
    }
};

export {
    toggleProfileVisibility,
    togglePushNotifications,
};
