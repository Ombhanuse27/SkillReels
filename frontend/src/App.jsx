import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';

// Protected Route Wrapper to secure the feed
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Protected Route */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <FeedPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Catch-all route to redirect unknown URLs */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;