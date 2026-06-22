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
                // Safely extract arrays from various API response structures
                const videoArray = Array.isArray(data) ? data : (data?.rows || data?.videos || []);
                setVideos(videoArray);
            } catch (err) {
                console.error("Failed to load videos", err);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };
        loadVideos();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/50"></div>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-[#0a0a0a] text-center px-4 space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <p className="text-gray-300 font-medium mb-2">Your feed is empty.</p>
                    <p className="text-xs text-gray-500">Upload some videos to get started.</p>
                </div>
                <button 
                    onClick={() => dispatch(logout())} 
                    className="text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors px-6 py-2.5 rounded-xl text-white border border-white/5"
                >
                    Log Out
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full bg-black sm:max-w-md sm:mx-auto sm:border-x sm:border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 p-4 pt-6 z-40 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <h1 className="text-xl font-black text-white tracking-[0.2em] drop-shadow-md pointer-events-auto">SKILLREELS</h1>
                <button 
                    onClick={() => dispatch(logout())}
                    className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-white pointer-events-auto shadow-xl"
                >
                    <LogOut size={18} />
                </button>
            </div>

            <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {videos.map((video) => (
                    <VideoPlayer key={video.id || Math.random()} video={video} />
                ))}
            </div>
        </div>
    );
};

export default FeedPage;