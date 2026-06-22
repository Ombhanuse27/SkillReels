import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import api from '../api/axios';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            const result = await dispatch(loginUser({ email, password }));
            if (result.meta.requestStatus === 'fulfilled') navigate('/');
        } else {
            try {
                // Now passing name to the backend
                await api.post('/auth/register', { name, email, password });
                const result = await dispatch(loginUser({ email, password }));
                if (result.meta.requestStatus === 'fulfilled') navigate('/');
            } catch (err) {
                alert(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a] px-4">
            <div className="w-full max-w-sm p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isLogin ? 'Welcome Back' : 'Join SkillReels'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">
                        {isLogin ? 'Enter your details to sign in.' : 'Create an account to start learning.'}
                    </p>
                </div>
                
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Conditionally render the Name input for registration */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent transition-all"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent transition-all"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button"
                        className="text-white font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setName('');
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;