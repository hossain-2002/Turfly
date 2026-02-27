import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Calendar, Clock, MapPin, Shield, CheckCircle, Lock, User, Phone } from 'lucide-react';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getTurfById, addBooking } = useData();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestContact, setGuestContact] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Retrieve state
  const state = location.state as { turfId: string; date: string; startTime: number; price: number; duration: number } | null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!state) return <Navigate to="/turfs" replace />;

  const turf = getTurfById(state.turfId);
  if (!turf) return <Navigate to="/turfs" replace />;

  // Helper to format time to AM/PM
  const formatTime = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic Validation
    if (!guestName || !guestContact) {
        setLoading(false);
        setError('Please fill in all contact details.');
        return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create booking
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      turfId: turf.id,
      date: state.date,
      startTime: state.startTime,
      duration: state.duration,
      status: 'pending' as const, // Default to pending for admin verification
      totalPrice: state.price,
      createdAt: new Date().toISOString(),
      guestName: guestName,
      guestContact: guestContact
    };

    const isBooked = addBooking(newBooking);

    if (isBooked) {
      setSuccess(true);
      showToast('Booking successful! Manager will review it soon.', 'success');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    } else {
      setLoading(false);
      setError('This slot was just taken by another user. Please select a different time.');
      showToast('Booking failed. Slot unavailable.', 'error');
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-32">
        <div className="text-center animate-fade-in p-8 max-w-md w-full">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Booking Placed!</h2>
          <p className="text-slate-400 mb-8">
            Your booking request for <span className="font-semibold text-white">{turf.name}</span> is pending confirmation.
          </p>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full animate-progress-bar w-full" style={{animationDuration: '3s'}}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white">Secure Checkout</h1>
        <p className="mt-2 text-slate-400">Complete your payment to secure your slot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Order Summary */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
               <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
            </div>
            <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                    <img src={turf.images[0]} alt={turf.name} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                    <div>
                        <h4 className="font-bold text-gray-900">{turf.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" /> {turf.location}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                            {turf.sport}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400"/> Date</span>
                        <span className="font-medium text-gray-900">{state.date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400"/> Time</span>
                        <span className="font-medium text-gray-900">{formatTime(state.startTime)} - {formatTime(state.startTime + state.duration)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-medium text-gray-900">{state.duration} Hour</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">৳{state.price}</span>
                </div>
            </div>
          </div>
          
           <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100 text-sm text-green-700">
             <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
             <p>Your payment information is encrypted and secure. We never store your credit card details.</p>
           </div>
        </div>

        {/* Payment Form */}
        <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                 </div>

                 {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                 )}

                 <form onSubmit={handlePayment} className="space-y-5">
                    
                    {/* Contact Info */}
                    <div className="space-y-4 pb-4 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact Info</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Enter your full name" 
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 py-3 pl-10 px-4 border"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                />
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <div className="relative">
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="01 XXX XXX XXX" 
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 py-3 pl-10 px-4 border"
                                    value={guestContact}
                                    onChange={(e) => setGuestContact(e.target.value)}
                                />
                                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Card Info */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Card Info</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="0000 0000 0000 0000" 
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 py-3 pl-10 px-4 border"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                                <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="MM/YY" 
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 py-3 px-4 border"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="123" 
                                        className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 py-3 pl-10 px-4 border"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                    />
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all transform active:scale-[0.99] duration-300"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>Pay ৳{state.price} & Place Booking</>
                            )}
                        </button>
                    </div>
                 </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;