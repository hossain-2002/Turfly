import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { Calendar, User, Clock, Filter, DollarSign, TrendingUp, Users, ArrowRight, AlertCircle, MapPin, CheckCircle, LogOut, ClipboardList } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { user, login } = useAuth();
  const { turfs, bookings, confirmBooking, cancelBooking } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Manager Auth State
  const [isManagerAuth, setIsManagerAuth] = useState(false);
  const [mgrEmail, setMgrEmail] = useState('');
  const [mgrPass, setMgrPass] = useState('');
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Check if main auth user is already a manager
  useEffect(() => {
    if (user && user.role === UserRole.MANAGER) {
      setIsManagerAuth(true);
    }
  }, [user]);

  // Handle Dedicated Manager Login
  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mgrEmail === 'manager' && mgrPass === 'manager123') {
       setIsManagerAuth(true);
       showToast('Welcome back, Manager', 'success');
    } else {
       const success = await login(mgrEmail, mgrPass);
       if(success) {
         setIsManagerAuth(true);
         showToast('Login Successful', 'success');
       } else {
         setError('Invalid Manager ID or Password.');
         showToast('Authentication Failed', 'error');
       }
    }
  };

  // Identify Managed Turfs
  // NOTE: In mockData, 'Sarah Manager' has ID '2'.
  const MANAGER_ID = user?.role === UserRole.MANAGER ? user.id : '2'; 
  
  const myTurfs = turfs.filter((t) => t.managerId === MANAGER_ID);
  const myTurfIds = myTurfs.map((t) => t.id);
  
  // Filter bookings strictly for turfs owned by this manager
  const myBookings = bookings.filter((b) => myTurfIds.includes(b.turfId));

  // Stats Logic - Real-time calculation based on Context
  const totalRevenue = myBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingCount = myBookings.filter(b => b.status === 'pending').length;

  const filteredBookings = myBookings.filter(b => {
      if (statusFilter === 'all') return true;
      return b.status === statusFilter;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Actions
  const handleConfirm = (id: string) => {
    confirmBooking(id);
    showToast('Booking Confirmed Successfully', 'success');
  };

  const handleCancel = (id: string) => {
    if(window.confirm('Are you sure you want to cancel this booking?')) {
        cancelBooking(id);
        showToast('Booking Request Declined', 'info');
    }
  };

  const handleLogout = () => {
      setIsManagerAuth(false);
      navigate('/');
      showToast('Logged out successfully', 'info');
  };

  // Helper to format time
  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isManagerAuth) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
        <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700 p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 shadow-inner">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Manager Portal</h2>
            <p className="text-sm text-slate-400 mt-2">
              Log in with credentials provided by Admin.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleManagerLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Manager ID / Email</label>
              <input 
                type="text" 
                placeholder="manager" 
                className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-500"
                value={mgrEmail}
                onChange={(e) => setMgrEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-500"
                value={mgrPass}
                onChange={(e) => setMgrPass(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 flex items-center justify-center transform active:scale-[0.98] hover:scale-[1.02]"
            >
              Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-white transition-colors">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#0F172A]">
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back. Manage your arena bookings.</p>
        </div>
        <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-bold border border-slate-700 flex items-center transition-all duration-300 hover:scale-105"
        >
            <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. My Turf Rates */}
            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-slate-700 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pricing</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Your Rates</h3>
                {myTurfs.length > 0 ? (
                    myTurfs.map(t => (
                        <div key={t.id} className="flex justify-between items-center text-sm border-t border-slate-700 pt-2 mt-2">
                            <span className="text-slate-300">{t.name}</span>
                            <span className="font-bold text-emerald-400">৳{t.pricePerHour}/hr</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No turfs assigned.</p>
                )}
            </div>

            {/* 2. Revenue */}
            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-slate-700 hover:border-blue-500/30 transition-all duration-300">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-900/30 text-blue-400 border border-blue-500/30">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Confirmed Revenue</span>
                </div>
                <span className="block text-sm font-medium text-slate-400">Total Revenue</span>
                <span className="block text-3xl font-bold text-white mt-1">৳{totalRevenue.toLocaleString()}</span>
            </div>

            {/* 3. Pending Requests */}
            <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-slate-700 hover:border-yellow-500/30 transition-all duration-300">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                        <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Action Needed</span>
                </div>
                <span className="block text-sm font-medium text-slate-400">Pending Requests</span>
                <span className="block text-3xl font-bold text-white mt-1">{pendingCount}</span>
            </div>
      </div>

      {/* Booking Requests Table Section */}
      <div className="bg-[#1E293B] shadow-xl rounded-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                <Users className="w-5 h-5 text-emerald-500" />
             </div>
             <h3 className="text-lg leading-6 font-bold text-white">Booking Requests</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
                className="text-sm bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                  <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Turf Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
              </thead>
              <tbody className="bg-[#1E293B] divide-y divide-slate-700">
                {filteredBookings.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                             <div className="flex flex-col items-center justify-center animate-fade-in">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                                    <ClipboardList className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-medium text-white">No bookings found</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                  No bookings found matching your criteria.
                                </p>
                             </div>
                        </td>
                    </tr>
                ) : (
                    filteredBookings.map((booking) => {
                      const turf = turfs.find(t => t.id === booking.turfId);
                      return (
                          <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                                          {booking.guestName ? booking.guestName.charAt(0) : <User className="w-5 h-5" />}
                                      </div>
                                      <div className="ml-4">
                                          <div className="text-sm font-bold text-white">{booking.guestName || 'Unknown User'}</div>
                                          <div className="text-xs text-slate-400 flex items-center mt-0.5">
                                               {booking.guestContact || 'N/A'}
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-slate-200">{turf?.name}</div>
                                  <div className="text-xs text-slate-400 flex items-center mt-1">
                                      <MapPin className="w-3 h-3 mr-1" /> {turf?.location}
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col space-y-1">
                                      <span className="text-sm text-slate-200 flex items-center">
                                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                          {booking.date}
                                      </span>
                                      <span className="text-xs text-slate-400 flex items-center">
                                          <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                          {formatTime(booking.startTime)} - {formatTime(booking.startTime + booking.duration)}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border transition-all duration-300 ${
                                      booking.status === 'confirmed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                                      booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30 animate-pulse-slow' :
                                      'bg-red-900/30 text-red-400 border-red-500/30'
                                  }`}>
                                      {booking.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end space-x-3">
                                      {booking.status === 'pending' && (
                                          <button 
                                              onClick={() => handleConfirm(booking.id)}
                                              className="text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center border border-emerald-500 active:scale-95 hover:scale-105"
                                          >
                                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirm
                                          </button>
                                      )}
                                      {booking.status !== 'cancelled' && (
                                          <button 
                                              onClick={() => handleCancel(booking.id)}
                                              className="text-red-400 hover:bg-red-900/30 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border border-transparent hover:border-red-900/50 active:scale-95 hover:scale-105"
                                          >
                                              Cancel
                                          </button>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      );
                    })
                )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;