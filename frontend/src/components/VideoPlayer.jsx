import React, { useRef, useEffect, useState } from 'react';
import useElementOnScreen from '../hooks/useElementOnScreen';
import VideoActions from './VideoActions';
import CommentSheet from './CommentSheet';

const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    // Trigger visibility when 70% of the video is on screen
    const isVisible = useElementOnScreen({ threshold: 0.7 }, videoRef);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    // Autoplay logic
    useEffect(() => {
        if (isVisible) {
            // Some browsers block autoplay if the user hasn't interacted with the DOM yet
            videoRef.current?.play().catch(() => console.log("Autoplay blocked by browser."));
        } else {
            videoRef.current?.pause();
            // Reset video to start when scrolled away
            if (videoRef.current) videoRef.current.currentTime = 0; 
        }
    }, [isVisible]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    // Construct the full backend URL to stream the video
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const videoUrl = `${backendUrl}${video.file_path}`;

    return (
        <div className="relative w-full h-screen snap-center bg-black overflow-hidden flex justify-center items-center">
            
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                onClick={togglePlay}
            />

            {/* Video Details Overlay */}
            <div className="absolute bottom-0 left-0 p-6 pb-8 w-3/4 z-30 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
                <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-md">
                        {video.category}
                    </span>
                </div>
                <h2 className="text-xl font-bold mb-2">{video.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
            </div>

            {/* Interactions */}
            <VideoActions video={video} onOpenComments={() => setIsCommentsOpen(true)} />
            <CommentSheet videoId={video.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
            
        </div>
    );
};

export default VideoPlayer;