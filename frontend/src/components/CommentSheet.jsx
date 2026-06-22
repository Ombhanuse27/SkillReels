import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchComments, postComment } from '../api/video';
import { X, Loader2 } from 'lucide-react';

const CommentSheet = ({ videoId, isOpen, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && videoId) {
            setIsLoading(true);
            fetchComments(videoId)
                .then(setComments)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, videoId]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const addedComment = await postComment(videoId, newComment);
            // Optimistically add the new comment to the top
            setComments(prev => [addedComment, ...prev]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment');
        }
    };

    // Helper to get initials for the avatar
    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="absolute bottom-0 left-0 right-0 h-[75%] bg-[#0d0d0d]/95 backdrop-blur-xl z-50 rounded-t-[2rem] flex flex-col border-t border-white/10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center p-5 border-b border-white/5">
                            <h3 className="font-bold text-lg text-white">Comments <span className="text-gray-500 text-sm ml-2">{comments.length}</span></h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-300">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollbarWidth: 'none' }}>
                            {isLoading ? (
                                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-gray-500" /></div>
                            ) : comments.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center mt-10 font-medium">Be the first to comment.</p>
                            ) : (
                                comments.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                                            {getInitials(c.user_name || c.name)}
                                        </div>
                                        {/* Comment Body */}
                                        <div className="flex-1">
                                            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-sm text-gray-200 leading-relaxed shadow-sm">
                                                <span className="font-bold text-white text-xs block mb-1">
                                                    {c.user_name || c.name || 'Anonymous User'}
                                                </span>
                                                {c.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handlePost} className="p-4 border-t border-white/5 flex gap-3 bg-transparent">
                            <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 outline-none text-sm text-white placeholder-gray-500 focus:bg-white/10 focus:border-white/20 transition-all shadow-inner"
                            />
                            <button 
                                type="submit" 
                                disabled={!newComment.trim()}
                                className="bg-white disabled:bg-white/20 disabled:text-white/50 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors shadow-lg"
                            >
                                Post
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommentSheet;