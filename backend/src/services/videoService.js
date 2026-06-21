import pool from '../config/db.js';

export const getAllVideos = async () => {
    const result = await pool.query('SELECT * FROM videos ORDER BY created_at DESC');
    return result.rows;
};

export const getVideoById = async (id) => {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    return result.rows[0];
};

export const likeVideo = async (userId, videoId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO likes (user_id, video_id) VALUES ($1, $2)', [userId, videoId]);
        await client.query('UPDATE videos SET like_count = like_count + 1 WHERE id = $1', [videoId]);
        await client.query('COMMIT');
        return { message: 'Video liked successfully' };
    } catch (e) {
        await client.query('ROLLBACK');
        if (e.code === '23505') throw new Error('Already liked'); 
        throw e;
    } finally {
        client.release();
    }
};

export const addComment = async (userId, videoId, content) => {
    const result = await pool.query(
        'INSERT INTO comments (user_id, video_id, content) VALUES ($1, $2, $3) RETURNING *',
        [userId, videoId, content]
    );
    return result.rows[0];
};

export const getCommentsByVideoId = async (videoId) => {
    const result = await pool.query('SELECT * FROM comments WHERE video_id = $1 ORDER BY created_at DESC', [videoId]);
    return result.rows;
};

export const bookmarkVideo = async (userId, videoId) => {
    try {
        await pool.query('INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2)', [userId, videoId]);
        return { message: 'Video bookmarked successfully' };
    } catch (e) {
        if (e.code === '23505') throw new Error('Already bookmarked');
        throw e;
    }
};