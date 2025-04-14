import express from 'express';
import { isAuth } from '../utils/auth.js';
import { addComment, createPost, deletePost, getAllPosts, getOverallAnalytics, getPostAnalytics, getSinglePost, getUserAnalytics, getUserPosts, likeOrUnlikePost, searchPosts, updatePost } from '../controllers/post/postController.js';

const router = express.Router();

router.post('/posts', isAuth, createPost);
router.get('/getAllPosts', isAuth, getAllPosts);
router.get('/posts/:id', isAuth, getSinglePost);
router.put('/posts/:id', isAuth, updatePost);
router.delete('/posts/:id', isAuth, deletePost);
router.get('/posts/user/:userId', getUserPosts);
router.post('/posts/:id/like', isAuth, likeOrUnlikePost);
router.post('/posts/:id/comment', isAuth, addComment);
router.post('/searchPosts', isAuth, searchPosts);
router.get('/posts/analytics/overall', getOverallAnalytics);
router.get('/posts/analytics/:postId', isAuth, getPostAnalytics);
router.get('/users/analytics/:userId', isAuth, getUserAnalytics);


export { router as PostRoute }