import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { fetchVideos } from '../api/video';
import { logout } from '../redux/authSlice';
import VideoPlayer from '../components/VideoPlayer';

const FeedPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
useEffect(() => {
        const loadVideos = async () => {
            try {
                const data = await fetchVideos();
                
                // FIX: Force it to be an array, catching nested objects
                console.log("Backend Video Data:", data); // Check your console to see the real structure
                
                let videoArray = [];
                if (Array.isArray(data)) {
                    videoArray = data;
                } else if (data?.rows) {
                    videoArray = data.rows; // Common for PostgreSQL
                } else if (data?.videos) {
                    videoArray = data.videos;
                }
                
                setVideos(videoArray);
            } catch (err) {
                console.error("Failed to load videos", err);
                setVideos([]); // Fallback to empty array on error
            } finally {
                setLoading(false);
            }
        };
        loadVideos();
    },[]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-[#0a0a0a] text-center px-4">
                <p className="text-gray-400 mb-4">No videos found. Please ensure they are added to the database.</p>
                <button 
                    onClick={() => dispatch(logout())} 
                    className="text-sm bg-white/10 hover:bg-white/20 transition px-6 py-2 rounded-lg text-white"
                >
                    Log Out
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full bg-black sm:max-w-md sm:mx-auto sm:border-x sm:border-white/10 overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-6 z-40 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <h1 className="text-xl font-bold text-white tracking-widest drop-shadow-md">SKILLCASE</h1>
                <button 
                    onClick={() => dispatch(logout())}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition text-white"
                    title="Log Out"
                >
                    <LogOut size={20} />
                </button>
            </div>

            {/* Vertical Snap Feed */}
            {/* CSS snap-y and snap-mandatory handle the smooth scrolling to exactly one video */}
            <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar relative">
                {videos.map((video) => (
                    <VideoPlayer key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default FeedPage;