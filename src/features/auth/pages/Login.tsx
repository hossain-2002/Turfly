import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import GoogleIcon from '@/components/common/GoogleIcon';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from: string } | null;
  const from = state?.from || '/';

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

  return (
    <AuthLayout
      title="Sign in"
      subtitle={
        <>
          Don't have an account? <Link to="/register" className="font-medium text-primary-500 hover:text-emerald-600">Sign up now</Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 border rounded-lg p-3 flex items-start bg-red-50 border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-red-500" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="csrf_token" value="mock_csrf_token" />

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!error}
            className="block w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={!!error}
              className="block w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 accent-primary-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-primary-500 hover:text-emerald-600 font-medium">
            Forgot Password?
          </a>
        </div>

        {/* Sign in button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2.5 px-4 btn-primary text-white font-bold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5 border-gray-300">
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-xs font-medium text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      {/* Google sign in */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-full font-medium transition-all disabled:opacity-70 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>
    </AuthLayout>
  );
};

export default Login;