import { createVideo as createVideoService,getAllVideos, getVideoById, likeVideo as likeVideoService, addComment as addCommentService, getCommentsByVideoId, bookmarkVideo as bookmarkVideoService } from '../services/videoService.js';

export const getVideos = async (req, res, next) => {
    try {
        const videos = await getAllVideos(req.user?.id);
        res.json(videos);
    } catch (err) {
        next(err);
    }
};

export const getVideo = async (req, res, next) => {
    try {
        const video = await getVideoById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.json(video);
    } catch (err) {
        next(err);
    }
};

export const likeVideo = async (req, res, next) => {
    try {
        const result = await likeVideoService(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addComment = async (req, res, next) => {
    try {
        const comment = await addCommentService(req.user.id, req.params.id, req.body.content);
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await getCommentsByVideoId(req.params.id);
        res.json(comments);
    } catch (err) {
        next(err);
    }
};

export const bookmarkVideo = async (req, res, next) => {
    try {
        const result = await bookmarkVideoService(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createVideo = async (req, res, next) => {
    try {
        const { title, description, category, file_path } = req.body;
        // In a real app, you might use multer to handle the file upload here.
        // For this assignment, we are registering the local file paths of the downloaded videos.
        const newVideo = await createVideoService(title, description, category, file_path);
        res.status(201).json(newVideo);
    } catch (err) {
        next(err);
    }
};