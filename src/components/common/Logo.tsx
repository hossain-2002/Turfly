import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  iconSize?: string;
  textSize?: string;
  textColor?: string;
  primaryColorClass?: string;
  hideTextOnMobile?: boolean;
  containerClassName?: string;
  iconContainerClassName?: string;
  disableLink?: boolean;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  iconSize = 'w-10 h-10',
  textSize = 'text-3xl',
  textColor = 'text-gray-900 dark:text-white',
  primaryColorClass = 'text-primary-500',
  hideTextOnMobile = false,
  containerClassName = '',
  iconContainerClassName = '',
  disableLink = false,
  isDark = false,
}) => {
  const content = (
    <>
      <div className={`${iconSize} ${iconContainerClassName} ${isDark ? 'filter invert brightness-150' : ''}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="turfly-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z" stroke="url(#turfly-logo-grad)" strokeWidth="3" fill="none" strokeLinejoin="round" />
          <path d="M20 38C20 38 22 25 32 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 38C20 38 10 28 12 18" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className={`${textSize} font-black tracking-tight transition-colors duration-300 ${textColor} ${hideTextOnMobile ? 'hidden sm:block' : ''}`}>
        Turfl<span className={`${primaryColorClass} italic`}>y</span>
      </span>
    </>
  );

  if (disableLink) {
    return <div className={`flex items-center gap-2 ${containerClassName}`}>{content}</div>;
  }

  return (
    <Link to="/" className={`flex items-center gap-2 group cursor-pointer select-none ${containerClassName}`}>
      {content}
    </Link>
  );
};

export default Logo;
