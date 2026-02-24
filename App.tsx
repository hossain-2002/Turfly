import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import TurfList from './pages/TurfList';
import TurfDetail from './pages/TurfDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Support from './pages/Support';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import PortalSelection from './pages/PortalSelection';
import ScrollToTop from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Route Loader Component for Professional Feel
const RouteLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate system check/data fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-mono animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/turfs" element={<TurfList />} />
                <Route path="/turfs/:id" element={<TurfDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/support" element={<Support />} />

                {/* Hidden/Restricted Routes with Loader Effect */}
                <Route path="/portal-access" element={<PortalSelection />} />
                
                <Route path="/admin-dashboard" element={
                  <RouteLoader>
                    <AdminDashboard />
                  </RouteLoader>
                } />
                
                <Route path="/manager-dashboard" element={
                  <RouteLoader>
                    <ManagerDashboard />
                  </RouteLoader>
                } />

                {/* Protected Routes (Authenticated Users) */}
                <Route path="/my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;