import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RouteLoaderProps {
  children: React.ReactNode;
}

const RouteLoader: React.FC<RouteLoaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-mono animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteLoader;
