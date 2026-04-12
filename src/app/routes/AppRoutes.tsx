import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from '@/layouts/Layout';
import ScrollToTop from '@/components/common/ScrollToTop';
import ProtectedRoute from '@/app/routes/ProtectedRoute';
import RouteLoader from '@/app/routes/RouteLoader';

const Home = lazy(() => import('@/features/home/pages/Home'));
const TurfList = lazy(() => import('@/features/turfs/pages/TurfList'));
const TurfDetail = lazy(() => import('@/features/turfs/pages/TurfDetail'));
const Login = lazy(() => import('@/features/auth/pages/Login'));
const Register = lazy(() => import('@/features/auth/pages/Register'));
const Support = lazy(() => import('@/features/support/pages/Support'));
const MyBookings = lazy(() => import('@/features/bookings/pages/MyBookings'));
const Checkout = lazy(() => import('@/features/bookings/pages/Checkout'));
const AdminDashboard = lazy(() => import('@/features/dashboard/pages/AdminDashboard'));
const ManagerDashboard = lazy(() => import('@/features/dashboard/pages/ManagerDashboard'));

const RouteSuspenseFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <p className="text-slate-400 text-sm font-mono animate-pulse">Establishing Secure Connection...</p>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<RouteSuspenseFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turfs" element={<TurfList />} />
            <Route path="/turfs/:id" element={<TurfDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/support" element={<Support />} />

            <Route
              path="/admin-dashboard"
              element={
                <RouteLoader>
                  <AdminDashboard />
                </RouteLoader>
              }
            />

            <Route
              path="/manager-dashboard"
              element={
                <RouteLoader>
                  <ManagerDashboard />
                </RouteLoader>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default AppRoutes;
