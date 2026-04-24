import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-10 px-8 shadow-lg sm:rounded-2xl transition-colors duration-300 border bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          {/* Logo */}
          <Link to="/" className="flex justify-center items-center gap-2 mb-6 group">
            <div className="w-10 h-10 transition-transform duration-500 group-hover:rotate-12">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="auth-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z" stroke="url(#auth-logo-grad)" strokeWidth="3" fill="none" strokeLinejoin="round" />
                <path d="M20 38C20 38 22 25 32 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 38C20 38 10 28 12 18" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-3xl font-black tracking-tight transition-colors duration-300 text-gray-900 dark:text-white">
              Turfl<span className="text-primary-500 italic">y</span>
            </span>
          </Link>

          {/* Title and Subtitle */}
          <h2 className="mt-6 text-center text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm transition-colors duration-300 text-gray-600 dark:text-slate-400">
            {subtitle}
          </p>

          {/* Form Content */}
          <div className="mt-6">
            {children}
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs transition-colors duration-300 text-gray-500 dark:text-slate-500">
          &copy; 2026 Turfly. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;