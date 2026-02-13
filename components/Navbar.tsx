import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Menu, X, LogOut, User as UserIcon, Settings, ChevronDown, Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Hidden Trigger State
  const [logoClicks, setLogoClicks] = useState(0);

  // Profile Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside Listener for Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Hidden Admin Trigger Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Reset count if inactive for 2 seconds
    if (logoClicks > 0 && logoClicks < 5) {
      timer = setTimeout(() => setLogoClicks(0), 2000);
    }
    
    // Trigger navigation on 5th click
    if (logoClicks === 5) {
      navigate('/portal-access');
      setLogoClicks(0);
    }
    
    return () => clearTimeout(timer);
  }, [logoClicks, navigate]);

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Ensure these paths match App.tsx Routes exactly
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Turfs', path: '/turfs' },
    ...(isAuthenticated ? [{ name: 'My Bookings', path: '/my-bookings' }] : []),
    { name: 'Support', path: '/support' },
  ];

  // --- Styles Logic ---
  const isDark = theme === 'dark';

  // Floating Capsule Style:
  // Fixed position, centered horizontally, top margin.
  // Z-Index boosted to 100 to ensure it sits above everything (Hero, Modals, etc.)
  // Width 95%, Rounded-2xl.
  // Border: 2px Solid Emerald (#10B981).
  const navContainerClass = `
    fixed top-4 z-[100] 
    w-[95%] left-1/2 -translate-x-1/2
    rounded-2xl 
    border-2 border-[#10B981]
    shadow-[0_0_15px_rgba(16,185,129,0.2)]
    font-sans transition-colors duration-300
    ${isDark ? 'bg-[#0F172A]' : 'bg-white'}
  `;

  // Text Colors
  const linkBaseClass = isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600';
  const linkActiveClass = isDark ? 'text-white' : 'text-slate-900';
  const logoTextClass = isDark ? 'text-white' : 'text-slate-900';
  
  // Mobile Menu Background
  const mobileMenuBg = isDark ? 'bg-[#0F172A]' : 'bg-white';

  return (
    <nav className={navContainerClass}>
      {/* Internal Padding px-10 to px-12 */}
      <div className="w-full px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center z-20">
                <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group cursor-pointer select-none">
                    {/* Logo Icon: In Dark Mode, invert colors and boost brightness for visibility */}
                    <div className={`relative w-9 h-9 transition-all duration-300 group-hover:rotate-180 ${isDark ? 'filter invert brightness-150' : ''}`}>
                         <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                            <defs>
                              <linearGradient id="logo-grad-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                            </defs>
                            <path d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z" stroke="url(#logo-grad-nav)" strokeWidth="3" fill="none" strokeLinejoin="round" />
                            <path d="M20 38C20 38 22 25 32 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M20 38C20 38 10 28 12 18" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                    </div>
                    {/* Logo Text */}
                    <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${logoTextClass} hidden sm:block`}>
                      Turfl<span className="text-emerald-500 italic">y</span>
                    </span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
                {navLinks.map((link) => {
                    // Strict Active Logic: 
                    // 1. If path is '/', only active if pathname is exactly '/'
                    // 2. Otherwise, active if pathname starts with link path
                    const isActive = link.path === '/' 
                      ? location.pathname === '/' 
                      : location.pathname.startsWith(link.path);

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`
                                relative group text-sm font-bold transition-colors duration-300
                                ${isActive ? linkActiveClass : linkBaseClass}
                            `}
                        >
                            {link.name}
                            {/* Underline Effect */}
                            <span className={`
                                absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 rounded-full
                                ${isActive ? 'w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'w-0 group-hover:w-full'}
                            `}></span>
                        </Link>
                    )
                })}
            </div>

            {/* Desktop Auth / Profile */}
            <div className="hidden md:flex items-center gap-5">
                
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'}`}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {isAuthenticated && user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 focus:outline-none transition-opacity hover:opacity-90"
                        >
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border shadow-sm transition-all ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                {user.name.charAt(0)}
                             </div>
                             <div className={`hidden lg:flex items-center gap-2 transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
                                <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                             </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`
                            absolute right-0 mt-5 w-60 rounded-2xl shadow-xl border overflow-hidden py-2 origin-top-right transition-all duration-200
                            ${isProfileOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                            ${isDark ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-gray-100'}
                        `}>
                            <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-50 bg-gray-50'}`}>
                                <p className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Signed in as</p>
                                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                            </div>
                            
                            <div className="py-2">
                                <Link to="#" className={`flex items-center px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'}`}>
                                    <UserIcon className="w-4 h-4 mr-3" /> My Profile
                                </Link>
                                <Link to="#" className={`flex items-center px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'}`}>
                                    <Settings className="w-4 h-4 mr-3" /> Settings
                                </Link>
                            </div>
                            
                            <div className={`border-t my-1 pt-1 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                    <LogOut className="w-4 h-4 mr-3" /> Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                         <Link 
                            to="/login" 
                            className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                         >
                            Log in
                         </Link>
                         <Link
                            to="/register"
                            className="bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                         >
                            Sign Up
                         </Link>
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-3">
                 <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors focus:outline-none ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-gray-100'}`}
                 >
                    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                 </button>
                 <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2 rounded-lg transition-colors focus:outline-none ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-gray-100'}`}
                 >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                 </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu (Contained within the capsule by keeping nav rounded) */}
      <div 
         className={`
           md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out
           ${mobileMenuBg} rounded-b-2xl
           ${isDark ? 'border-slate-700/50' : 'border-gray-100'}
           ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
         `}
      >
         <div className="px-6 py-8 space-y-6 max-h-[80vh] overflow-y-auto">
             {/* Links */}
             <div className="space-y-2">
                 {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`block text-xl font-bold px-4 py-3 rounded-xl transition-colors ${
                            (link.path === '/' 
                              ? location.pathname === '/' 
                              : location.pathname.startsWith(link.path))
                                ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200')
                                : (isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50')
                        }`}
                    >
                        {link.name}
                    </Link>
                 ))}
             </div>

             <div className={`h-px w-full my-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}></div>

             {/* Mobile Auth Profile */}
             {isAuthenticated && user ? (
                 <div className="space-y-6">
                     <div className={`flex items-center gap-4 px-4 py-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border ${isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white text-emerald-600 border-emerald-100'}`}>
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                            <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <Link to="#" className={`flex items-center text-base font-bold px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-50'}`}>
                             <UserIcon className="w-5 h-5 mr-3 text-emerald-500" /> My Profile
                        </Link>
                        <Link to="#" className={`flex items-center text-base font-bold px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-50'}`}>
                             <Settings className="w-5 h-5 mr-3 text-emerald-500" /> Settings
                        </Link>
                        <button onClick={handleLogout} className={`w-full flex items-center text-base font-bold text-red-500 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                             <LogOut className="w-5 h-5 mr-3" /> Log out
                        </button>
                     </div>
                 </div>
             ) : (
                 <div className="flex flex-col gap-4 pt-2">
                    <Link to="/login" className={`w-full text-center py-4 font-bold border rounded-xl transition-colors ${isDark ? 'text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white' : 'text-slate-700 border-gray-200 hover:bg-gray-50'}`}>
                        Log in
                    </Link>
                    <Link to="/register" className="w-full text-center py-4 bg-[#10B981] text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors">
                        Sign Up
                    </Link>
                 </div>
             )}
         </div>
      </div>
    </nav>
  );
};

export default Navbar;