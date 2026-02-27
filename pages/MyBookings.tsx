import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Navigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';

const MyBookings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getBookingsByUser, turfs, cancelBooking } = useData();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const myBookings = getBookingsByUser(user.id);

  // Helper to format time to AM/PM
  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Sort bookings: Future bookings first
  const sortedBookings = [...myBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${String(a.startTime).padStart(2, '0')}:00`);
    const dateB = new Date(`${b.date}T${String(b.startTime).padStart(2, '0')}:00`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    // Midnight Pro Background & Spacing
    <div className="max-w-7xl mx-auto pt-36 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#0F172A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <Link to="/turfs" className="mt-4 sm:mt-0 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Book another turf &rarr;
          </Link>
      </div>
      
      {sortedBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#1E293B] rounded-2xl border-2 border-dashed border-slate-700">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-white">No bookings yet</h3>
          <p className="mt-1 text-sm text-slate-400">You haven't booked any turfs yet. Let's find one!</p>
          <div className="mt-6">
            <Link to="/turfs" className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg shadow-emerald-500/20 text-sm font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-500 transition-all">
              Browse Turfs
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Cancellation Policy Notice */}
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-start">
              <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Cancellation Policy:</span> You can cancel for a full refund up to 24 hours before your slot.
                </p>
              </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedBookings.map((booking) => {
                const turf = turfs.find(t => t.id === booking.turfId);
                const isCancelled = booking.status === 'cancelled';
                const bookingDateTime = new Date(`${booking.date}T${String(booking.startTime).padStart(2, '0')}:00`);
                const now = new Date();
                const isPast = bookingDateTime < now;
                
                // Calculate time difference in hours
                const timeDiff = bookingDateTime.getTime() - now.getTime();
                const hoursUntilSlot = timeDiff / (1000 * 3600);
                const canCancel = hoursUntilSlot >= 24;

                return (
                <div key={booking.id} className={`
                    relative bg-[#1E293B] rounded-2xl overflow-hidden flex flex-col transition-all duration-300
                    ${isCancelled 
                        ? 'border border-slate-800 opacity-60' 
                        : 'border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    }
                `}>
                    <div className="h-32 bg-slate-800 relative">
                        <img src={turf?.images[0]} alt={turf?.name} className="w-full h-full object-cover grayscale-[20%]" />
                        <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${
                                isCancelled 
                                    ? 'bg-red-900/80 text-red-100 border border-red-500/30' 
                                    : isPast 
                                        ? 'bg-slate-700/80 text-slate-300 border border-slate-600'
                                        : 'bg-emerald-900/80 text-emerald-100 border border-emerald-500/30'
                            }`}>
                                {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Confirmed'}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white line-clamp-1">{turf?.name}</h3>
                            <span className="text-sm font-semibold text-emerald-400">৳{booking.totalPrice}</span>
                        </div>
                        
                        <div className="space-y-2 mt-2">
                            <p className="flex items-center text-sm text-slate-400">
                                <Calendar className="w-4 h-4 mr-2 text-slate-500" /> 
                                {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="flex items-center text-sm text-slate-400">
                                <Clock className="w-4 h-4 mr-2 text-slate-500" /> 
                                {formatTime(booking.startTime)} - {formatTime(booking.startTime + booking.duration)}
                            </p>
                            <p className="flex items-center text-sm text-slate-400 line-clamp-1">
                                <MapPin className="w-4 h-4 mr-2 text-slate-500" /> 
                                {turf?.location}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-700 flex gap-3">
                            {!isCancelled && !isPast && (
                                <button 
                                    onClick={() => {
                                        if (canCancel) {
                                            if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                                                cancelBooking(booking.id);
                                            }
                                        } else {
                                            alert('Cancellations are only allowed at least 24 hours in advance.');
                                        }
                                    }}
                                    disabled={!canCancel}
                                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-colors border ${
                                        canCancel 
                                            ? 'bg-[#1E293B] border-red-900/50 text-red-400 hover:bg-red-900/20' 
                                            : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                                    title={!canCancel ? "Cancellation unavailable within 24h of booking" : "Cancel this booking"}
                                >
                                    {canCancel ? 'Cancel' : 'No Refund'}
                                </button>
                            )}
                            
                            <Link 
                                to={`/turfs/${turf?.id}`} 
                                className={`text-center py-2 px-3 rounded-xl text-sm font-bold transition-colors border border-transparent shadow-lg shadow-emerald-500/20 ${
                                    !isCancelled && !isPast 
                                        ? 'flex-1 bg-emerald-600 text-white hover:bg-emerald-500' 
                                        : 'w-full bg-emerald-600 text-white hover:bg-emerald-500'
                                }`}
                            >
                                Book Again
                            </Link>
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;