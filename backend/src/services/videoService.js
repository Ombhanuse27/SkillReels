import pool from '../config/db.js';

// FIX 1: Fetch exact counts and boolean flags for the UI
export const getAllVideos = async (userId = null) => {
    const query = `
        SELECT 
            v.*,
            COALESCE((SELECT COUNT(*) FROM likes WHERE video_id = v.id), 0) AS likes_count,
            COALESCE((SELECT COUNT(*) FROM comments WHERE video_id = v.id), 0) AS comments_count,
            EXISTS(SELECT 1 FROM likes WHERE video_id = v.id AND user_id = $1) AS is_liked,
            EXISTS(SELECT 1 FROM bookmarks WHERE video_id = v.id AND user_id = $1) AS is_bookmarked
        FROM videos v
        ORDER BY v.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const getVideoById = async (id) => {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    return result.rows[0];
};

// FIX 2: Smart Toggle for Likes (Insert OR Delete)
export const likeVideo = async (userId, videoId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Check if the like already exists
        const check = await client.query('SELECT * FROM likes WHERE user_id = $1 AND video_id = $2', [userId, videoId]);

        if (check.rows.length > 0) {
            // UNLIKE
            await client.query('DELETE FROM likes WHERE user_id = $1 AND video_id = $2', [userId, videoId]);
            await client.query('UPDATE videos SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1', [videoId]);
            await client.query('COMMIT');
            return { message: 'Video unliked successfully', is_liked: false };
        } else {
            // LIKE
            await client.query('INSERT INTO likes (user_id, video_id) VALUES ($1, $2)', [userId, videoId]);
            await client.query('UPDATE videos SET like_count = like_count + 1 WHERE id = $1', [videoId]);
            await client.query('COMMIT');
            return { message: 'Video liked successfully', is_liked: true };
        }
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// FIX 3: Smart Toggle for Bookmarks (Insert OR Delete)
export const bookmarkVideo = async (userId, videoId) => {
    const check = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND video_id = $2', [userId, videoId]);

    if (check.rows.length > 0) {
        // UN-BOOKMARK
        await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND video_id = $2', [userId, videoId]);
        return { message: 'Video removed from bookmarks', is_bookmarked: false };
    } else {
        // BOOKMARK
        await pool.query('INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2)', [userId, videoId]);
        return { message: 'Video bookmarked successfully', is_bookmarked: true };
    }
};

export const addComment = async (userId, videoId, content) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Insert the comment and get its new ID
        const insertResult = await client.query(
            'INSERT INTO comments (user_id, video_id, content) VALUES ($1, $2, $3) RETURNING id',
            [userId, videoId, content]
        );
        const newCommentId = insertResult.rows[0].id;

        // 2. Fetch the newly created comment joined with the user's name
        const fetchResult = await client.query(`
            SELECT c.*, u.name as user_name 
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id 
            WHERE c.id = $1
        `, [newCommentId]);

        await client.query('COMMIT');
        
        // Return the fully populated comment object to the frontend
        return fetchResult.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const getCommentsByVideoId = async (videoId) => {
    const query = `
        SELECT c.*, u.name as user_name 
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id 
        WHERE c.video_id = $1 
        ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [videoId]);
    return result.rows;
};

export const createVideo = async (title, description, category, filePath) => {
    const result = await pool.query(
        'INSERT INTO videos (title, description, category, file_path) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, category, filePath]
    );
    return result.rows[0];
};