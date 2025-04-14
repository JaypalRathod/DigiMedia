import Post from '../../models/Post.js';
import User from '../../models/UserModel.js';
import { fail, match, ObjectId, project, success } from '../../utils/helper.js';

const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { media, text, category } = req.body;

        const post = new Post({ userId, media, text, category });
        await post.save();

        return success(res, 'Post created successfully', post);
    } catch (err) {
        return fail(res, err.message);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;
        const filter = category ? { category } : {};

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'name')
            .populate('comments.userId', 'name');

        return success(res, 'Posts fetched', posts);
    } catch (err) {
        return fail(res, err.message);
    }
};

const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'name')
            .populate('comments.userId', 'name');

        if (!post) return fail(res, 'Post not found');
        return success(res, 'Post fetched', post);
    } catch (err) {
        return fail(res, err.message);
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!post) return fail(res, 'Post not found or unauthorized');
        return success(res, 'Post updated', post);
    } catch (err) {
        return fail(res, err.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!post) return fail(res, 'Post not found or unauthorized');
        return success(res, 'Post deleted');
    } catch (err) {
        return fail(res, err.message);
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        return success(res, 'User posts fetched', posts);
    } catch (err) {
        return fail(res, err.message);
    }
};

const likeOrUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return fail(res, 'Post not found');

        const index = post.likes.indexOf(req.userId);
        if (index === -1) {
            post.likes.push(req.userId); // like
        } else {
            post.likes.splice(index, 1); // unlike
        }

        await post.save();
        return success(res, 'Post like status updated', post.likes);
    } catch (err) {
        return fail(res, err.message);
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return fail(res, 'Post not found');

        post.comments.push({ userId: req.userId, text });
        await post.save();

        return success(res, 'Comment added', post.comments);
    } catch (err) {
        return fail(res, err.message);
    }
};

const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return fail(res, 'Query is required');

        const posts = await Post.find({
            $or: [
                { text: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        return success(res, 'Posts fetched', posts);
    } catch (err) {
        return fail(res, err.message);
    }
};

const getPostAnalytics = async (req, res) => {
    try {
        const postId = ObjectId(req.params.postId);

        const stats = await Post.aggregate([
            match({ _id: postId }),
            project({
                _id: 0,
                postId: "$_id",
                views: 1,
                likeCount: { $size: "$likes" },
                commentCount: { $size: "$comments" }
            })
        ]);

        if (!stats.length) return fail(res, 'Post not found');
        return success(res, 'Post analytics fetched', stats[0]);
    } catch (err) {
        return fail(res, err.message);
    }
};

const getOverallAnalytics = async (req, res) => {
    try {
        const [userCount, postCount, commentStats, likeStats] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Post.aggregate([
                {
                    $group: {
                        _id: null,
                        totalComments: { $sum: { $size: "$comments" } }
                    }
                }
            ]),
            Post.aggregate([
                {
                    $group: {
                        _id: null,
                        totalLikes: { $sum: { $size: "$likes" } }
                    }
                }
            ])
        ]);

        return success(res, 'Overall analytics fetched', {
            users: userCount,
            posts: postCount,
            comments: commentStats[0]?.totalComments || 0,
            likes: likeStats[0]?.totalLikes || 0
        });
    } catch (err) {
        return fail(res, err.message);
    }
};

const getUserAnalytics = async (req, res) => {
    try {
        const userId = ObjectId(req.params.userId);

        const stats = await Post.aggregate([
            match({ userId }),
            {
                $group: {
                    _id: "$userId",
                    postCount: { $sum: 1 },
                    totalLikes: { $sum: { $size: "$likes" } },
                    totalViews: { $sum: "$views" }
                }
            },
            project({
                _id: 0,
                postCount: 1,
                totalLikes: 1,
                totalViews: 1
            })
        ]);

        return success(res, 'User analytics fetched', stats[0] || { postCount: 0, totalLikes: 0, totalViews: 0 });
    } catch (err) {
        return fail(res, err.message);
    }
};


export {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getUserPosts,
    likeOrUnlikePost,
    addComment,
    searchPosts,
    getPostAnalytics,
    getOverallAnalytics,
    getUserAnalytics
}