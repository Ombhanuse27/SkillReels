import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import api from '../api/axios';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Pull loading and error state directly from Redux
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            const result = await dispatch(loginUser({ email, password }));
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            }
        } else {
            try {
                // Register the user first
                await api.post('/auth/register', { email, password });
                // Then automatically log them in
                const result = await dispatch(loginUser({ email, password }));
                if (result.meta.requestStatus === 'fulfilled') {
                    navigate('/');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a] px-4">
            <div className="w-full max-w-sm p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isLogin ? 'Welcome Back' : 'Join Skillcase'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">
                        {isLogin ? 'Enter your details to sign in.' : 'Create an account to start learning.'}
                    </p>
                </div>
                
                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/50 p-3 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent transition"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button"
                        className="text-white font-semibold hover:underline transition"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;