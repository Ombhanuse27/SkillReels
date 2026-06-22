import React, { useRef, useEffect, useState } from 'react';
import useElementOnScreen from '../hooks/useElementOnScreen';
import VideoActions from './VideoActions';
import CommentSheet from './CommentSheet';

const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const isVisible = useElementOnScreen({ threshold: 0.7 }, videoRef);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    if (!video) return null; // Defensive guard

    useEffect(() => {
        if (isVisible && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Browser policy blocked autoplay; wait for user interaction silently
            });
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; 
        }
    }, [isVisible]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        videoRef.current.paused ? videoRef.current.play().catch(()=>{}) : videoRef.current.pause();
    };

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const cleanPath = video.file_path?.startsWith('/') ? video.file_path : `/${video.file_path}`;

    return (
        <div className="relative w-full h-screen snap-center bg-black overflow-hidden flex justify-center items-center">
            <video
                ref={videoRef}
                src={`${backendUrl}${cleanPath}`}
                className="w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                onClick={togglePlay}
            />

            <div className="absolute bottom-0 left-0 p-6 pb-8 w-3/4 z-30 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                {video.category && (
                    <div className="mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-md text-white shadow-lg">
                            {video.category}
                        </span>
                    </div>
                )}
                <h2 className="text-xl font-bold mb-2 text-white drop-shadow-md">{video.title}</h2>
                <p className="text-sm text-gray-200 line-clamp-2 drop-shadow">{video.description}</p>
            </div>

            <VideoActions video={video} onOpenComments={() => setIsCommentsOpen(true)} />
            <CommentSheet videoId={video.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
        </div>
    );
};

export default VideoPlayer;