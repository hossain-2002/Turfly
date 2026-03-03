import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    await register(name, email, password);
    setLoading(false);
    navigate('/');
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
              type="password"
              required
              className="focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 border"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${confirmPassword && confirmPassword !== password ? 'text-red-400' : confirmPassword && confirmPassword === password ? 'text-emerald-400' : 'text-gray-400'}`} />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`focus:ring-[#10B981] focus:border-[#10B981] block w-full pl-10 sm:text-sm rounded-md py-2.5 border ${confirmPassword && confirmPassword !== password
                  ? 'border-red-400 bg-red-50'
                  : confirmPassword && confirmPassword === password
                    ? 'border-emerald-400'
                    : 'border-gray-300'
                }`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
          {confirmPassword && confirmPassword === password && (
            <p className="mt-1 text-xs text-emerald-500">✓ Passwords match</p>
          )}
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

      <div className="mt-6">
        <p className="text-xs text-center text-gray-500">
          By clicking "Create Account", you agree to our <a href="#" className="underline hover:text-[#10B981]">Terms of Service</a> and <a href="#" className="underline hover:text-[#10B981]">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;