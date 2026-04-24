import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { Helmet } from 'react-helmet-async';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900">
      <Helmet>
        <title>{title} | Turfly</title>
      </Helmet>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-10 px-8 shadow-2xl sm:rounded-2xl border bg-white border-gray-200">
          <Logo
            containerClassName="justify-center mb-6"
            iconContainerClassName="transition-transform duration-500 group-hover:rotate-12"
            textColor="text-gray-900"
          />

          {/* Title and Subtitle */}
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>

          {/* Form Content */}
          <div className="mt-6">
            {children}
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; 2026 Turfly. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;