import api from './axios';

export const fetchVideos = async () => {
    const response = await api.get('/videos');
    return response.data;
};

export const likeVideoAPI = async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
};

export const bookmarkVideoAPI = async (videoId) => {
    const response = await api.post(`/videos/${videoId}/bookmark`);
    return response.data;
};

export const fetchComments = async (videoId) => {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response.data;
};

export const postComment = async (videoId, content) => {
    const response = await api.post(`/videos/${videoId}/comment`, { content });
    return response.data;
};