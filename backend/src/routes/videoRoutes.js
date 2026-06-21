import express from 'express';
import { getVideos, getVideo, likeVideo, addComment, getComments, bookmarkVideo,createVideo } from '../controllers/videoController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/:id', getVideo);

router.post('/:id/like', authenticate, likeVideo);
router.post('/:id/comment', authenticate, addComment);
router.get('/:id/comments', getComments);
router.post('/:id/bookmark', authenticate, bookmarkVideo);
router.post('/', authenticate, createVideo);

export default router;