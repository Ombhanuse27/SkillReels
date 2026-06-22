import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchComments, postComment } from '../api/video';
import { X } from 'lucide-react';

const CommentSheet = ({ videoId, isOpen, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Fetch comments only when the sheet is opened
    useEffect(() => {
        if (isOpen) {
            fetchComments(videoId).then(setComments).catch(console.error);
        }
    }, [isOpen, videoId]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const addedComment = await postComment(videoId, newComment);
            // Add the new comment to the top of the list
            setComments([addedComment, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Background Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-40"
                        onClick={onClose}
                    />
                    
                    {/* Sliding Bottom Sheet */}
                    <motion.div 
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 h-2/3 bg-[#121212] z-50 rounded-t-3xl flex flex-col border-t border-white/10"
                    >
                        <div className="flex justify-between items-center p-5 border-b border-white/5">
                            <h3 className="font-bold text-lg">Comments</h3>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {comments.map(c => (
                                <div key={c.id} className="bg-white/5 p-4 rounded-xl text-sm leading-relaxed">
                                    {c.content}
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className="text-gray-500 text-center mt-10">Be the first to comment!</p>
                            )}
                        </div>

                        <form onSubmit={handlePost} className="p-4 border-t border-white/5 flex gap-3 bg-[#121212]">
                            <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-white/10 rounded-full px-5 py-3 outline-none text-sm focus:ring-1 focus:ring-white/30 transition"
                            />
                            <button type="submit" className="bg-white text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-200 transition">
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