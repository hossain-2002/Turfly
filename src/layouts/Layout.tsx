import React, { ReactNode } from 'react';
import Navbar from '@/components/common/Navbar';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

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
              <Logo
                iconSize="w-8 h-8 flex-shrink-0"
                textSize="text-xl"
                textColor="text-white"
              />
              <p className="text-slate-400 text-sm leading-relaxed">
                The #1 platform for sports enthusiasts. Book your favorite turf in seconds and get back to doing what you love.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
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