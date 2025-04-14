import express from 'express';
import { isAuth } from '../utils/auth.js';
import { getFeed, listFollowers, listFollowing, toggleFollow } from '../controllers/follow/FollowController.js';

const router = express.Router();

router.post("/toggleFollow", isAuth, toggleFollow);
router.get("/followers/:userId?", isAuth, listFollowers);
router.get("/following/:userId?", isAuth, listFollowing);
router.get("/feed", isAuth, getFeed);

export { router as FollowRoute }
