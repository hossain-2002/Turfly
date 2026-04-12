import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, User, ShieldCheck, LayoutDashboard, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import GoogleIcon from '@/components/common/GoogleIcon';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthorityOptions, setShowAuthorityOptions] = useState(false);

  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from: string } | null;
  const from = state?.from || '/';

  const handleAuthorityAccess = (role: 'admin' | 'manager') => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    if (role === 'manager') {
      navigate('/manager-dashboard');
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Email or password is incorrect');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Unable to sign in with Google. Please try again.');
    }
  };

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
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-md py-2.5 border text-black placeholder:text-gray-500"
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
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-black placeholder:text-gray-500"
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

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-70"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>

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

      {/* Authority footer link */}
      <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500">
        <button
          type="button"
          onClick={() => setShowAuthorityOptions((prev) => !prev)}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Authority
          <ArrowRight className={`h-4 w-4 transition-transform ${showAuthorityOptions ? 'rotate-90' : ''}`} />
        </button>

        {showAuthorityOptions && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAuthorityAccess('admin')}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleAuthorityAccess('manager')}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Manager
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;