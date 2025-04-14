import Follow from "../../models/Follow.js";
import Post from "../../models/Post.js";
import { success, fail } from "../../utils/helper.js";

const toggleFollow = async (req, res) => {
    try {
        const userId = req.userId;
        const { targetUserId } = req.body;

        if (userId === targetUserId) {
            return fail(res, "You cannot follow yourself");
        }

        const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });

        if (existingFollow) {
            await Follow.findByIdAndDelete(existingFollow._id);
            return success(res, "Unfollowed successfully");
        } else {
            await Follow.create({ follower: userId, following: targetUserId });
            return success(res, "Followed successfully");
        }
    } catch (err) {
        return fail(res, err.message);
    }
};

const listFollowers = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const followers = await Follow.find({ following: userId }).populate("follower", "first_name last_name image");

        return success(res, "Followers fetched", followers.map(f => f.follower));
    } catch (err) {
        return fail(res, err.message);
    }
};

const listFollowing = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const following = await Follow.find({ follower: userId }).populate("following", "first_name last_name image");

        return success(res, "Following fetched", following.map(f => f.following));
    } catch (err) {
        return fail(res, err.message);
    }
};

const getFeed = async (req, res) => {
    try {
        const userId = req.userId;

        const following = await Follow.find({ follower: userId }).select("following");

        const followingIds = following.map(f => f.following);

        const posts = await Post.find({ userId: { $in: followingIds } }).sort({ createdAt: -1 });

        return success(res, "Feed fetched", posts);
    } catch (err) {
        return fail(res, err.message);
    }
};

export {
    toggleFollow,
    listFollowers,
    listFollowing,
    getFeed,
};
