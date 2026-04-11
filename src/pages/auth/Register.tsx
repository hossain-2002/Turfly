import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.24 9.24 3.66l6.9-6.9C35.92 2.7 30.47 0 24 0 14.62 0 6.51 5.36 2.56 13.17l8.05 6.26C12.48 13.06 17.82 9.5 24 9.5z" />
    <path fill="#FBBC05" d="M46.14 24.55c0-1.64-.15-3.22-.42-4.75H24v9h12.44c-.54 2.93-2.19 5.41-4.66 7.07l7.16 5.55c4.18-3.86 7.2-9.56 7.2-16.87z" />
    <path fill="#34A853" d="M12.6 28.57A14.4 14.4 0 0 1 11.8 24c0-1.6.28-3.15.8-4.57l-8.05-6.26A23.98 23.98 0 0 0 0 24c0 3.86.92 7.51 2.56 10.83l10.04-7.8z" />
    <path fill="#4285F4" d="M24 48c6.47 0 11.89-2.13 15.85-5.79l-7.16-5.55c-1.98 1.33-4.52 2.1-8.69 2.1-6.18 0-11.52-3.56-14.4-8.57l-10.04 7.8C8.51 42.64 16.62 48 24 48z" />
  </svg>
);

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'User already exists. Please sign in');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Unable to sign in with Google. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#10B981] hover:text-emerald-600">
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <input type="hidden" name="csrf_token" value="mock_csrf_token" />

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
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
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
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
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-slate-900"
              placeholder="Min 6 characters"
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

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#10B981] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] disabled:opacity-70 transition-all"
          >
            {loading ? 'Creating account...' : 'Create Account'}
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
        <GoogleLogo />
        Continue with Google
      </button>

      <div className="mt-6">
        <p className="text-xs text-center text-gray-500">
          By clicking "Create Account", you agree to our <a href="#" className="underline hover:text-[#10B981]">Terms of Service</a> and <a href="#" className="underline hover:text-[#10B981]">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;