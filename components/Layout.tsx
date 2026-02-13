import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Applied Midnight Pro Colors: Deep Slate background, Slate-300 text
    <div className="min-h-screen bg-[#0F172A] text-slate-300 flex flex-col font-sans transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Professional Footer - Midnight Pro Style */}
      <footer className="bg-[#0F172A] border-t border-slate-800 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                 <div className="w-8 h-8 flex-shrink-0">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <defs>
                        <linearGradient id="footer-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <path d="M20 2L35.5885 11V29L20 38L4.41154 29V11L20 2Z" stroke="url(#footer-logo-grad)" strokeWidth="3" fill="none" strokeLinejoin="round" />
                      <path d="M20 38C20 38 22 25 32 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M20 38C20 38 10 28 12 18" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                 </div>
                 <span className="text-xl font-black text-white">
                   Turfl<span className="text-emerald-500 italic">y</span>
                 </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                The #1 platform for sports enthusiasts. Book your favorite turf in seconds and get back to doing what you love.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Facebook className="w-5 h-5"/></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Instagram className="w-5 h-5"/></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Twitter className="w-5 h-5"/></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Linkedin className="w-5 h-5"/></a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Partners</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/support" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Help Center</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Booking Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-400 text-sm">
                   <MapPin className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                   <span>123 Sports Avenue, Dhaka, Bangladesh</span>
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                   <Phone className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                   <span>+880 1234 567890</span>
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                   <Mail className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" />
                   <span>hello@turfly.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; 2026 Turfly. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <span className="text-slate-500 text-sm">Crafted with <span className="text-red-500">♥</span> by SHISHIIR.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;