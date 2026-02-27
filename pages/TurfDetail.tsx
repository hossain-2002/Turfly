import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, CheckCircle, Info, Star, ShieldCheck, Wifi, Car, Droplets } from 'lucide-react';

const TurfDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { selectedDate?: string } | null;
  const { getTurfById, bookings, checkAvailability } = useData();
  const { isAuthenticated } = useAuth();
  
  const turf = getTurfById(id || '');
  
  // Initialize date from state passed from TurfList or default to today
  const initialDate = state?.selectedDate || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState('');

  if (!turf) return <div className="text-center py-20 text-slate-500">Turf not found</div>;

  // Generate slots from 06:00 (6) to 23:00 (23)
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6); 

  // Helper to format time to AM/PM
  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // UI Helper: Check if slot looks booked based on local state
  const isSlotBookedUI = (time: number) => {
    return bookings.some(b => 
      b.turfId === turf.id && 
      b.date === selectedDate && 
      b.status === 'confirmed' &&
      time >= b.startTime && 
      time < (b.startTime + b.duration)
    );
  };

  const handleBooking = () => {
    setBookingError('');
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/turfs/${id}` } });
      return;
    }

    if (!selectedDate || selectedTime === null) return;

    // FINAL VALIDATION: Check availability against the data context (Mock DB)
    // This prevents race conditions where UI might be stale
    const isAvailable = checkAvailability(turf.id, selectedDate, selectedTime);

    if (!isAvailable) {
      setBookingError('Slot Unavailable: This time slot was just booked by another user.');
      setSelectedTime(null); // Deselect the invalid slot
      return;
    }

    // Navigate to Checkout with booking details
    navigate('/checkout', { 
        state: {
            turfId: turf.id, 
            date: selectedDate, 
            startTime: selectedTime, 
            price: turf.pricePerHour,
            duration: 1
        }
    });
  };

  // Icon mapping for amenities
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('park')) return <Car className="w-4 h-4 mr-2 text-slate-500" />;
    if (lower.includes('water')) return <Droplets className="w-4 h-4 mr-2 text-slate-500" />;
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4 mr-2 text-slate-500" />;
    return <CheckCircle className="w-4 h-4 mr-2 text-slate-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-slate-400 mb-2">
           <span className="cursor-pointer hover:text-emerald-400" onClick={() => navigate('/turfs')}>Turfs</span>
           <span className="mx-2">/</span>
           <span className="text-white font-medium">{turf.name}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">{turf.name}</h1>
                <p className="text-slate-400 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-2 text-emerald-500" /> {turf.location} • {turf.sport}
                </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
                 <div className="flex items-center bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-900/50">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-bold text-yellow-400">4.8</span>
                    <span className="ml-1 text-xs text-slate-400">(124 reviews)</span>
                 </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-md bg-slate-800 border border-slate-700 aspect-video relative group">
            <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
          
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-8 transition-colors">
            {/* H2 Updated with Midnight Pro Styling */}
            <h2 className="text-2xl font-extrabold text-white mb-6 pl-4 border-l-4 border-emerald-500 tracking-tight">About this turf</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">{turf.description}</p>
            
            <h3 className="font-semibold text-white mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
              {turf.amenities.map(am => (
                <div key={am} className="flex items-center text-sm text-slate-300 bg-slate-700/50 p-2 rounded-lg border border-slate-700">
                  {getAmenityIcon(am)}
                  {am}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 sticky top-24 transition-colors">
            <div className="flex justify-between items-end mb-6 border-b border-slate-700 pb-4">
              <div>
                <span className="text-3xl font-bold text-white">৳{turf.pricePerHour}</span>
                <span className="text-slate-400">/hour</span>
              </div>
            </div>

            <div className="space-y-5">
            {bookingError && (
                <div className="p-3 rounded-md bg-red-900/20 border border-red-900/50 text-sm text-red-400 flex items-start animate-fade-in">
                    <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"/>
                    {bookingError}
                </div>
            )}
            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Select Date</label>
                <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors"
                    value={selectedDate}
                    onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(null);
                    setBookingError('');
                    }}
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Select Start Time</label>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {timeSlots.map((time) => {
                    const booked = isSlotBookedUI(time);
                    const isSelected = selectedTime === time;
                    
                    return (
                    <button
                        key={time}
                        disabled={!selectedDate || booked}
                        onClick={() => {
                            setSelectedTime(time);
                            setBookingError('');
                        }}
                        className={`
                        py-2 px-1 text-xs font-bold rounded-md border transition-all relative
                        ${isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30 ring-offset-1 ring-offset-slate-800 z-10' 
                            : booked 
                            ? 'bg-slate-700/50 text-slate-600 border-slate-700 cursor-not-allowed decoration-slice' 
                            : 'bg-transparent text-[#10B981] border-[#10B981] hover:bg-[#10B981] hover:text-white hover:shadow-sm'}
                        `}
                    >
                        {formatTime(time)}
                        {booked && <span className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-px bg-slate-500 rotate-45 transform origin-center"></div>
                        </span>}
                    </button>
                    );
                })}
                </div>
                {!selectedDate && <p className="text-xs text-slate-500 mt-1">Please select a date first</p>}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <div className="flex items-center"><div className="w-3 h-3 border border-[#10B981] rounded mr-1"></div> Available</div>
                    <div className="flex items-center"><div className="w-3 h-3 border border-emerald-600 bg-emerald-600 rounded mr-1"></div> Selected</div>
                    <div className="flex items-center"><div className="w-3 h-3 border border-slate-700 bg-slate-700/50 rounded mr-1"></div> Booked</div>
                </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700">
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-medium text-white">1 Hour</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-400">Service Fee</span>
                    <span className="font-medium text-white">৳0.00</span>
                </div>
                    <div className="flex justify-between items-center mb-6">
                    <span className="text-white font-bold">Total</span>
                    <span className="font-extrabold text-2xl text-emerald-500">৳{turf.pricePerHour}</span>
                </div>
                
                <button
                    onClick={handleBooking}
                    disabled={!selectedDate || selectedTime === null}
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all
                        ${!selectedDate || selectedTime === null 
                            ? 'bg-slate-600 cursor-not-allowed shadow-none' 
                            : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-xl transform active:scale-[0.98]'}
                    `}
                >
                    {isAuthenticated ? 'Pay & Book Now' : 'Login to Book'}
                </button>
            </div>
            </div>
            
            <div className="mt-6 bg-blue-900/10 p-4 rounded-lg flex items-start border border-blue-900/30">
                 <ShieldCheck className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                 <div>
                     <p className="text-xs font-semibold text-blue-300 mb-1">Cancellation Policy</p>
                     <p className="text-xs text-blue-400 leading-relaxed">
                        Full refund if cancelled at least 24 hours before the slot time. No questions asked.
                     </p>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetail;