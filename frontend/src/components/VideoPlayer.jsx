import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react'; // 1. Import Volume icons
import useElementOnScreen from '../hooks/useElementOnScreen';
import VideoActions from './VideoActions';
import CommentSheet from './CommentSheet';

const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true); // 2. Add Mute State
    const isVisible = useElementOnScreen({ threshold: 0.7 }, videoRef);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    if (!video) return null;

    useEffect(() => {
        if (isVisible && videoRef.current) {
            videoRef.current.play().catch(() => {});
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
            
            {/* 3. The Volume Toggle Button */}
            <button 
                className="absolute top-6 right-6 z-40 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <video
                ref={videoRef}
                src={`${backendUrl}${cleanPath}`}
                className="w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                muted={isMuted} // 4. Apply the state here
                onClick={togglePlay}
            />

            {/* Video Details Overlay */}
            <div className="absolute bottom-0 left-0 p-6 pb-8 w-3/4 z-30 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-xl font-bold mb-2 text-white">{video.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
            </div>

            <VideoActions video={video} onOpenComments={() => setIsCommentsOpen(true)} />
            <CommentSheet videoId={video.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
        </div>
    );
};

export default VideoPlayer;