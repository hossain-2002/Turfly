import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, ArrowRight, Lock } from 'lucide-react';

const PortalSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30">
      
      {/* Header Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Lock className="w-10 h-10 text-slate-200 relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Secure Access Gate
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Authorized personnel only. Please select your specific access terminal to proceed with authentication.
        </p>
      </div>

      {/* Dual Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Admin Portal Card */}
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className="group relative bg-[#1E293B] hover:bg-[#1E293B]/80 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/50 text-left transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Admin Portal</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Full system control. Manage bookings, configure turf details, and oversee platform revenue.
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold text-emerald-500 group-hover:translate-x-2 transition-transform duration-300">
                Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
              </div>
           </div>
        </button>

        {/* Manager Portal Card */}
        <button 
          onClick={() => navigate('/manager-dashboard')}
          className="group relative bg-[#1E293B] hover:bg-[#1E293B]/80 p-8 rounded-3xl border border-slate-700 hover:border-blue-500/50 text-left transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-7 h-7 text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Manager Portal</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Location specific management. Handle incoming booking requests and view rate cards.
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold text-blue-500 group-hover:translate-x-2 transition-transform duration-300">
                Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
              </div>
           </div>
        </button>

      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => navigate('/')}
          className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Return to Homepage
        </button>
      </div>

    </div>
  );
};

export default PortalSelection;