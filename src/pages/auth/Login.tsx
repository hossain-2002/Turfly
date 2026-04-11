import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, User, ShieldCheck, LayoutDashboard, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';

type Role = 'user' | 'admin' | 'manager' | null;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from: string } | null;
  const from = state?.from || '/';

  const handleRoleSelect = (role: Role) => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    if (role === 'manager') {
      navigate('/manager-dashboard');
      return;
    }
    setSelectedRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  // ─── Role Selection Screen ────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-200 mb-5">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign in to Turfly</h1>
            <p className="text-slate-500 mt-2 text-sm">Select your role to continue</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">

            {/* User */}
            <button
              onClick={() => handleRoleSelect('user')}
              className="w-full group relative bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">User</p>
                  <p className="text-sm text-slate-500 truncate">Browse & book turf slots</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full group relative bg-white border-2 border-slate-200 hover:border-violet-400 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Admin</p>
                  <p className="text-sm text-slate-500 truncate">Full system control & management</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </div>
            </button>

            {/* Manager */}
            <button
              onClick={() => handleRoleSelect('manager')}
              className="w-full group relative bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Manager</p>
                  <p className="text-sm text-slate-500 truncate">Manage bookings & turf locations</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </div>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ─── User Login Form ──────────────────────────────────────────────────────
  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          Don't have an account? <Link to="/register" className="font-medium text-[#10B981] hover:text-emerald-600">Sign up</Link>
        </>
      }
    >
      {/* Back button */}
      <button
        onClick={() => setSelectedRole(null)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to role selection
      </button>

      {/* Role badge */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg w-fit">
        <User className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-700">Signing in as User</span>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="csrf_token" value="mock_csrf_token" />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-md py-2.5 border text-slate-900"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-slate-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#10B981] focus:ring-[#10B981] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-[#10B981] hover:text-emerald-600">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#10B981] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] disabled:opacity-70 transition-all"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      {/* Demo credentials */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-center font-mono">
          <div
            className="bg-gray-50 p-2 rounded border cursor-pointer hover:bg-gray-100"
            onClick={() => { setEmail('user@example.com'); setPassword('password123'); }}
          >
            user@example.com
          </div>
          <div
            className="bg-gray-50 p-2 rounded border cursor-pointer hover:bg-gray-100"
            onClick={() => { setEmail('manager@example.com'); setPassword('password123'); }}
          >
            manager@example.com
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;