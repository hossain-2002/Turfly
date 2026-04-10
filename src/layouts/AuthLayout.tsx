import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center pt-32 pb-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-6">
        <Link to="/" className="flex justify-center items-center gap-3 mb-6 group">
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
           <span className="text-4xl font-black text-white tracking-tight">
             Turfl<span className="text-[#10B981] italic">y</span>
           </span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/20 sm:rounded-xl sm:px-10 border border-slate-700/50">
          {children}
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; 2023 Turfly. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;