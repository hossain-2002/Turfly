import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Support: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addTicket } = useData();
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    addTicket({
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      subject: formData.subject,
      message: formData.message,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    setSubmitted(true);
    setFormData({ subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Help & Support</h1>
        <p className="mt-4 text-lg text-slate-400">
          Need assistance with your booking? Our dedicated support team is here to help you get back in the game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
            { icon: Phone, title: 'Call Us', desc: 'Mon-Fri from 8am to 5pm.', action: '+1 (555) 123-4567', link: 'tel:+15551234567', color: 'bg-blue-900/30 text-blue-400' },
            { icon: Mail, title: 'Email Us', desc: 'We\'ll get back within 24h.', action: 'support@turfbook.com', link: 'mailto:support@turfbook.com', color: 'bg-green-900/30 text-green-400' },
            { icon: MessageSquare, title: 'Live Chat', desc: 'Available on mobile app.', action: 'Download App', link: '#', color: 'bg-purple-900/30 text-purple-400' }
        ].map((item, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 text-center border border-slate-700 hover:border-emerald-500/50 group">
                <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-slate-400 text-sm">{item.desc}</p>
                <a href={item.link} className="mt-4 block font-medium hover:underline text-emerald-400 hover:text-emerald-300">
                    {item.action}
                </a>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Ticket Form */}
        <div className="bg-slate-800 shadow-xl rounded-2xl overflow-hidden border border-slate-700 transition-colors">
            <div className="bg-slate-900/50 px-8 py-5 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <Send className="w-5 h-5 mr-2 text-emerald-500"/> 
                    Submit a Support Ticket
                </h3>
            </div>
            <div className="p-8">
            {submitted ? (
                <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 mb-6 animate-fade-in">
                    <Send className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Ticket Submitted!</h3>
                <p className="mt-2 text-slate-400 max-w-xs mx-auto">
                    We've received your message and will respond to your email shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
                    Submit another ticket
                </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {!isAuthenticated && (
                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30 flex items-start">
                        <HelpCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-200">Please <a href="/login" className="font-bold underline hover:text-white">login</a> to submit a support ticket so we can track your request.</p>
                    </div>
                )}
                <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-slate-300 mb-1.5">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        disabled={!isAuthenticated}
                        required
                        placeholder="e.g. Booking Cancellation Issue"
                        className="block w-full bg-slate-900 border-slate-600 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 border disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-300 mb-1.5">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        disabled={!isAuthenticated}
                        required
                        placeholder="Describe your issue in detail..."
                        className="block w-full bg-slate-900 border-slate-600 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-3 px-4 border disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!isAuthenticated}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                >
                    Submit Ticket
                </button>
                </form>
            )}
            </div>
        </div>

        {/* FAQ Section */}
        <div>
            <h2 className="text-2xl font-extrabold text-white mb-6 pl-4 border-l-4 border-emerald-500 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { q: "What is the cancellation policy?", a: "You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations made within 24 hours are non-refundable." },
                    { q: "Can I book equipment?", a: "Yes, many of our partner turfs offer equipment rental. Check the 'Amenities' section on the turf detail page to see if equipment is provided." },
                    { q: "Do I need to pay online?", a: "Yes, to secure your slot instantly, full payment is required online. We support major credit cards and digital wallets." },
                    { q: "What happens if it rains?", a: "If the turf is outdoors and unplayable due to rain, the turf manager will cancel the booking and initiate a full refund. Covered turfs are not affected." }
                ].map((faq, i) => (
                    <details key={i} className="group bg-slate-800 rounded-xl shadow-sm border border-slate-700 [&_summary::-webkit-details-marker]:hidden overflow-hidden transition-colors">
                        <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                            {faq.q}
                            <span className="ml-5 flex-shrink-0 transition duration-300 group-open:-rotate-180">
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            </span>
                        </summary>
                        <div className="p-5 pt-2 text-slate-300 leading-relaxed border-t border-slate-700 bg-slate-800/50">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Support;