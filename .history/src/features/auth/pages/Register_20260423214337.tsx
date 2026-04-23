import React, { useState, useEffect } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const htmlElement = document.documentElement;
    const checkDarkMode = () => {
      setIsDark(htmlElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

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
      title="Sign up"
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
        <div className={`mb-4 border rounded-lg p-3 flex items-start ${
          isDark 
            ? 'bg-red-900/20 border-red-800 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${isDark ? 'text-red-500' : 'text-red-500'}`} />
          <div className="text-sm">{error}</div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="csrf_token" value="mock_csrf_token" />

        {/* Full Name */}
        <div>
          <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={`block w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
            }`}
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`block w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
            }`}
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={`block text-sm font-medium mb-1 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className={`block w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                isDark ? 'text-slate-500 hover:text-slate-400' : 'text-gray-400 hover:text-gray-600'
              }`}
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

        {/* Sign up button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2.5 px-4 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Divider */}
      <div className={`flex items-center gap-3 my-5 ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
        <div className={`flex-1 border-t ${isDark ? 'border-slate-600' : 'border-gray-300'}`} />
        <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>OR</span>
        <div className={`flex-1 border-t ${isDark ? 'border-slate-600' : 'border-gray-300'}`} />
      </div>

      {/* Google sign up */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-full font-medium transition-all disabled:opacity-70 ${
          isDark
            ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>

      {/* Terms */}
      <p className={`mt-5 text-xs text-center ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
        By clicking "Create account", you agree to our <a href="#" className="text-[#10B981] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#10B981] hover:underline font-medium">Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
};

export default Register;