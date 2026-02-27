import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CheckCircle, Search, Filter, Calendar, Clock, Phone, User, MapPin, Trash2, ClipboardList, Lock, ArrowRight, AlertCircle, LogOut, Plus, DollarSign, Users, Briefcase } from 'lucide-react';
import { Turf, UserRole } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, turfs, confirmBooking, cancelBooking, clearAllBookings } = useData();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'management' | 'users'>('bookings');

  // Management Form State
  const [newTurf, setNewTurf] = useState({ name: '', location: '', price: '', manager: '' });
  const [showSuccessMsg, setShowSuccessMsg] = useState('');

  // Check for existing session auth on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Hardcoded secret for demo purposes
    if (password === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Access Denied: Invalid Security Key');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAddTurf = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API. Here we simulate success.
    setShowSuccessMsg(`Successfully added "${newTurf.name}" assigned to Manager ${newTurf.manager}`);
    setNewTurf({ name: '', location: '', price: '', manager: '' });
    setTimeout(() => setShowSuccessMsg(''), 3000);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const handleClearData = () => {
    if (window.confirm('WARNING: This will permanently delete ALL booking records. This action cannot be undone. Continue?')) {
        clearAllBookings();
    }
  };

  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredBookings = bookings.filter(booking => {
      const matchesSearch = 
        (booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.guestContact?.includes(searchTerm)) ||
        (booking.id.includes(searchTerm));
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // --- Secure Login View ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
        <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700 p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-sm text-slate-400 mt-2">
              Enter the master security key to manage the system.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Security Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center transform active:scale-[0.98]"
            >
              Authenticate <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-slate-500 hover:text-white font-medium transition-colors flex items-center justify-center mx-auto group"
            >
              <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" /> 
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">MASTER ACCESS</span>
              </div>
              <p className="text-slate-400">Manage bookings, turfs, and prices.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearData}
              className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded-lg text-sm font-bold border border-red-900/50 flex items-center transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All Data
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-bold border border-slate-700 flex items-center transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><ClipboardList className="w-16 h-16 text-white"/></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                <span className="block text-3xl font-bold text-white mt-1">{bookings.length}</span>
             </div>
             <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-10"><DollarSign className="w-16 h-16 text-emerald-500"/></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confirmed Revenue</span>
                <span className="block text-3xl font-bold text-emerald-500 mt-1">
                   ৳{bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + curr.totalPrice, 0)}
                </span>
             </div>
             <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Turfs</span>
                <span className="block text-3xl font-bold text-blue-400 mt-1">{turfs.length}</span>
             </div>
             <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Managers</span>
                <span className="block text-3xl font-bold text-purple-400 mt-1">3</span>
             </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 mb-8 space-x-6">
            <button 
                onClick={() => setActiveTab('bookings')}
                className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'bookings' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                Bookings Overview
                {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('management')}
                className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'management' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                Turf & Manager Management
                {activeTab === 'management' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'users' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                User Directory
                {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div>}
            </button>
        </div>

        {/* Tab Content: Bookings */}
        {activeTab === 'bookings' && (
            <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700 bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search by name, phone or ID..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select 
                        className="py-2.5 pl-3 pr-8 rounded-xl border border-slate-600 bg-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Turf</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#1E293B] divide-y divide-slate-700">
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
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
                                    <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                                                    {booking.guestName ? booking.guestName.charAt(0) : <User className="w-5 h-5" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-white">{booking.guestName || 'Unknown User'}</div>
                                                    <div className="text-sm text-slate-400 flex items-center mt-0.5">
                                                        <Phone className="w-3 h-3 mr-1" /> {booking.guestContact || 'N/A'}
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
                                            <div className="text-sm font-bold text-white">৳{booking.totalPrice}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border ${
                                                booking.status === 'confirmed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                                                booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                                                'bg-red-900/30 text-red-400 border-red-500/30'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                {booking.status === 'pending' && (
                                                    <button 
                                                        onClick={() => confirmBooking(booking.id)}
                                                        className="text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-900/20 flex items-center border border-emerald-500"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirm
                                                    </button>
                                                )}
                                                {booking.status !== 'cancelled' && (
                                                    <button 
                                                        onClick={() => {
                                                            if(window.confirm('Are you sure you want to cancel this booking?')) 
                                                                cancelBooking(booking.id)
                                                        }}
                                                        className="text-red-400 hover:bg-red-900/30 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-red-900/50"
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
        )}

        {/* Tab Content: Management */}
        {activeTab === 'management' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Turf/Manager Form */}
                <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-700 p-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                        <div className="p-2 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                            <Plus className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                             <h3 className="text-lg font-bold text-white">Add New Turf & Assign Manager</h3>
                             <p className="text-sm text-slate-400">Expand your business locations.</p>
                        </div>
                    </div>

                    {showSuccessMsg && (
                        <div className="mb-6 bg-emerald-900/20 border border-emerald-900/50 rounded-lg p-3 flex items-start">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-emerald-400 font-medium">{showSuccessMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleAddTurf} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Turf Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-3 rounded-xl border border-slate-600 bg-slate-800 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="e.g. Gulshan Sports Arena"
                                value={newTurf.name}
                                onChange={e => setNewTurf({...newTurf, name: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Location</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full p-3 rounded-xl border border-slate-600 bg-slate-800 text-white focus:ring-emerald-500"
                                    placeholder="Area Name"
                                    value={newTurf.location}
                                    onChange={e => setNewTurf({...newTurf, location: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Price / Hour (৳)</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full p-3 rounded-xl border border-slate-600 bg-slate-800 text-white focus:ring-emerald-500"
                                    placeholder="1500"
                                    value={newTurf.price}
                                    onChange={e => setNewTurf({...newTurf, price: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Assign Manager</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-3 rounded-xl border border-slate-600 bg-slate-800 text-white focus:ring-emerald-500"
                                placeholder="Manager's Full Name"
                                value={newTurf.manager}
                                onChange={e => setNewTurf({...newTurf, manager: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg mt-2 transition-all">
                            Add Turf & Create Manager
                        </button>
                    </form>
                </div>

                {/* Existing Turfs List */}
                <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-700 p-8">
                     <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700">
                        <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                            <Briefcase className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                             <h3 className="text-lg font-bold text-white">Manage Active Turfs</h3>
                             <p className="text-sm text-slate-400">View price lists and assignments.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {turfs.map(turf => (
                            <div key={turf.id} className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex justify-between items-center group hover:border-emerald-500/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-white">{turf.name}</h4>
                                    <div className="flex items-center text-xs text-slate-400 mt-1">
                                        <MapPin className="w-3 h-3 mr-1" /> {turf.location}
                                        <span className="mx-2">•</span>
                                        <span className="text-emerald-400 font-bold">৳{turf.pricePerHour}/hr</span>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500 flex items-center">
                                        <User className="w-3 h-3 mr-1" /> Manager ID: {turf.managerId}
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600">
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
             <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-lg font-bold text-white">Registered Users & Staff</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Mock Users View */}
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">A</div>
                        <div>
                            <p className="text-white font-bold">Admin User</p>
                            <p className="text-xs text-slate-400">admin@example.com</p>
                            <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20 mt-1 inline-block">Admin</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold border border-blue-500/20">S</div>
                        <div>
                            <p className="text-white font-bold">Sarah Manager</p>
                            <p className="text-xs text-slate-400">manager@example.com</p>
                            <span className="text-[10px] font-bold uppercase text-blue-500 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-500/20 mt-1 inline-block">Manager</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold border border-slate-600">J</div>
                        <div>
                            <p className="text-white font-bold">John Doe</p>
                            <p className="text-xs text-slate-400">user@example.com</p>
                            <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-600 mt-1 inline-block">User</span>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;