import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react'; 

const VideoActions = ({ video, onOpenComments }) => {
    // Local state to handle instant UI updates for likes
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(video?.likes || 0);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        // Note: In a full app, you would also trigger an API call here to update the DB
    };

    return (
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-40">
            {/* Like Button */}
            <button onClick={handleLike} className="flex flex-col items-center group">
                <div className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
                    isLiked ? 'bg-white/20 text-red-500' : 'bg-black/40 text-white group-hover:bg-white/20'
                }`}>
                    <Heart fill={isLiked ? "currentColor" : "none"} size={28} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md">
                    {likesCount}
                </span>
            </button>

            {/* Comment Button */}
            <button onClick={onOpenComments} className="flex flex-col items-center group">
                <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md group-hover:bg-white/20 transition-all duration-200">
                    <MessageCircle size={28} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md">
                    {video?.comments_count || 0}
                </span>
            </button>

            {/* Share Button */}
            <button className="flex flex-col items-center group">
                <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md group-hover:bg-white/20 transition-all duration-200">
                    <Share2 size={28} className="drop-shadow-lg" />
                </div>
                <span className="text-white text-xs font-bold mt-1.5 drop-shadow-md">
                    Share
                </span>
            </button>
        </div>
    );
};

export default VideoActions;