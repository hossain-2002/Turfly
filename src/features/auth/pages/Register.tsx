import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import GoogleIcon from '@/components/common/GoogleIcon';

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
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-black placeholder:text-gray-500"
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
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-black placeholder:text-gray-500"
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
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 border text-black placeholder:text-gray-500"
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
        <GoogleIcon className="h-5 w-5" />
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