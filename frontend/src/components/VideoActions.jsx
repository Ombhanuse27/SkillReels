import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Check } from 'lucide-react'; 
import api from '../api/axios'; 

const VideoActions = ({ video, onOpenComments }) => {
    // 1. Initial State mapping
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isShared, setIsShared] = useState(false);

    // Locking mechanism to prevent rapid-click Axios aborts
    const [isProcessingLike, setIsProcessingLike] = useState(false);
    const [isProcessingBookmark, setIsProcessingBookmark] = useState(false);

    // 2. CRITICAL FIX: Sync local state when the feed loads or refreshes!
   useEffect(() => {
        if (video) {
            console.log(`Video ID: ${video.id} | Liked: ${video.is_liked} | Bookmarked: ${video.is_bookmarked}`);
            
            setIsLiked(video.is_liked === true);
            setIsBookmarked(video.is_bookmarked === true);
            setLikesCount(parseInt(video.likes_count) || 0);
        }
    }, [video]);

    // 3. Optimistic Like Toggle
    const handleLike = async () => {
        if (isProcessingLike) return; // Prevent spam clicking
        setIsProcessingLike(true);

        const previousState = isLiked;
        const previousCount = likesCount;

        // Instantly update UI
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? Math.max(0, likesCount - 1) : likesCount + 1);

        try {
            await api.post(`/videos/${video.id}/like`);
        } catch (error) {
            console.error("Failed to like video", error);
            // Revert UI on failure
            setIsLiked(previousState);
            setLikesCount(previousCount);
        } finally {
            setIsProcessingLike(false);
        }
    };

    // 4. Optimistic Bookmark Toggle
    const handleBookmark = async () => {
        if (isProcessingBookmark) return;
        setIsProcessingBookmark(true);

        const previousState = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            await api.post(`/videos/${video.id}/bookmark`);
        } catch (error) {
            console.error("Failed to bookmark video", error);
            setIsBookmarked(previousState);
        } finally {
            setIsProcessingBookmark(false);
        }
    };

    // 5. Native Share
    const handleShare = async () => {
        const shareData = {
            title: video?.title || 'Check out this video on SkillReels',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
            }
        } catch (err) {
            console.log("Share cancelled");
        }
    };

    return (
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-40">
            {/* Like Button */}
            <button 
                onClick={handleLike} 
                disabled={isProcessingLike}
                className="flex flex-col items-center group disabled:opacity-80"
            >
                <div className={`p-3.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl ${
                    isLiked ? 'bg-white/20 text-red-500 scale-110' : 'bg-black/40 text-white border border-white/10 group-hover:bg-white/20'
                }`}>
                    <Heart fill={isLiked ? "currentColor" : "none"} size={26} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-md">
                    {likesCount > 0 ? likesCount : '0'}
                </span>
            </button>

            {/* Comment Button */}
            <button onClick={onOpenComments} className="flex flex-col items-center group">
                <div className="p-3.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
                    <MessageCircle size={26} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-md">
                    {parseInt(video?.comments_count) > 0 ? video.comments_count : '0'}
                </span>
            </button>

            {/* Bookmark Button */}
            <button 
                onClick={handleBookmark} 
                disabled={isProcessingBookmark}
                className="flex flex-col items-center group disabled:opacity-80"
            >
                <div className={`p-3.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl ${
                    isBookmarked ? 'bg-white/20 text-yellow-400 scale-110' : 'bg-black/40 text-white border border-white/10 group-hover:bg-white/20'
                }`}>
                    <Bookmark fill={isBookmarked ? "currentColor" : "none"} size={26} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-md">
                    Save
                </span>
            </button>

            {/* Share Button */}
            <button onClick={handleShare} className="flex flex-col items-center group">
                <div className="p-3.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
                    {isShared ? <Check size={26} className="text-green-400" /> : <Share2 size={26} className="drop-shadow-lg" />}
                </div>
                <span className="text-white text-xs font-bold mt-2 drop-shadow-md">
                    {isShared ? 'Copied!' : 'Share'}
                </span>
            </button>
        </div>
    );
};

export default VideoActions;