import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Lazy load pages for performance
const AuthPage = lazy(() => import('./pages/AuthPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Global Loading Fallback for Suspense
const PageLoader = () => (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>
);

function App() {
    return (
        <Router>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <FeedPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;