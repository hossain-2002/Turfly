import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, ArrowRight, Star, 
  Search as SearchIcon, CalendarCheck, PlayCircle, Trophy, 
  ChevronDown, ChevronLeft, ChevronRight, Zap, ShieldCheck, Headphones, Quote, X, Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import h1Img from '../images/h1.avif';
// Hero Slider Data
const HERO_SLIDES = [
  {
    id: 1,
    image: h1Img,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2070",
  },
 
];

// Testimonials Data
const TESTIMONIALS = [
  { name: "Rahul Karim", role: "Football Captain", text: "Turfly made organizing our weekly matches so much easier. The booking process is flawless.", rating: 5 },
  { name: "Sarah Ahmed", role: "Corporate HR", text: "We booked a tournament for our office retreat. The support team helped us find the perfect venue.", rating: 5 },
  { name: "Tanvir Hasan", role: "Cricket Enthusiast", text: "Finally a platform that verifies the turfs. No more bad surprises when we show up to play.", rating: 4 }
];

// Popular Locations for Dropdown
const POPULAR_LOCATIONS = [
  'Mirpur', 'Dhanmondi', 'Banani', 'Gulshan', 'Uttara', 
  'Motijheel', 'Shyamoli', 'Mohammadpur', 'Farmgate', 'Shahbag', 'Bashundhara'
];

// --- Calendar Helpers ---
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const CustomCalendar: React.FC<CalendarProps> = ({ selectedDate, onSelect, onClose }) => {
  // Parse selected date or default to today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Construct YYYY-MM-DD string
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    onSelect(dateStr);
    onClose();
  };

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDayOfMonth(viewDate);
  const blanks = Array(firstDay).fill(null);
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to check if a day is selected
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const sDate = new Date(selectedDate);
    return (
      sDate.getDate() === day &&
      sDate.getMonth() === viewDate.getMonth() &&
      sDate.getFullYear() === viewDate.getFullYear()
    );
  };

  // Helper to check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  // Disable past dates logic
  const isPast = (day: number) => {
     const today = new Date();
     today.setHours(0,0,0,0);
     const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
     return checkDate < today;
  };

  return (
    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in select-none">
       {/* Header */}
       <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
             <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900 text-sm">
             {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
             <ChevronRight className="w-5 h-5" />
          </button>
       </div>

       {/* Weekdays */}
       <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
             <div key={d} className="text-center text-xs font-bold text-gray-400">
                {d}
             </div>
          ))}
       </div>

       {/* Days Grid */}
       <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {currentDays.map(day => {
             const selected = isSelected(day);
             const today = isToday(day);
             const past = isPast(day);
             
             return (
               <div 
                 key={day}
                 onClick={(e) => !past && handleDayClick(day, e)}
                 className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${past ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                    ${selected 
                        ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/30 scale-105' 
                        : past ? '' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}
                    ${!selected && today ? 'ring-1 ring-emerald-500 text-emerald-600 font-bold' : ''}
                 `}
               >
                 {day}
               </div>
             );
          })}
       </div>
    </div>
  );
};


// Interface for the SearchForm props
interface SearchFormProps {
  filters: {
    location: string;
    sport: string;
    date: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    location: string;
    sport: string;
    date: string;
  }>>;
  onSearch: (e: React.FormEvent) => void;
  isSticky?: boolean;
}

// Optimized Search Form with Mobile "Smart Pill"
const SearchForm: React.FC<SearchFormProps> = ({ filters, setFilters, onSearch, isSticky }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Mobile Scroll Logic (Scroll-to-Hide)
  const [showStickyPill, setShowStickyPill] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Dropdown States
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll Listener for Mobile Sticky Pill
  useEffect(() => {
    if (!isSticky) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past hero, hide pill. If scrolling up, show pill.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowStickyPill(false);
      } else {
        setShowStickyPill(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isSticky]);

  // Filter locations
  const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(filters.location.toLowerCase())
  );

  const getDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // --- MOBILE STICKY PILL VIEW ---
  // If sticky mode and user hasn't expanded it, show the Pill at bottom center (Mobile Only)
  // On Desktop, isSticky renders the horizontal bar normally.
  const isMobile = window.innerWidth < 768; // Simple check, or could use hook

  if (isSticky && isMobile && !mobileExpanded) {
    return (
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${showStickyPill ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'}`}
      >
        <button 
          onClick={() => setMobileExpanded(true)}
          className="flex items-center gap-3 bg-[#0F172A]/90 backdrop-blur-xl border border-emerald-500/50 shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-white px-6 py-3.5 rounded-full animate-fade-in group active:scale-95 transition-transform"
        >
          <Search className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold tracking-wide pr-1">Find & Book Turf</span>
          <div className="h-4 w-px bg-slate-600 mx-1"></div>
          <span className="text-xs text-slate-400 font-medium">Anytime</span>
        </button>
      </div>
    );
  }

  // --- FULL FORM VIEW (Hero Static OR Mobile Expanded Overlay) ---
  const containerClasses = mobileExpanded
    ? 'fixed inset-0 z-[100] bg-[#0F172A] p-6 flex flex-col pt-24 animate-fade-in' // Full screen overlay on mobile
    : `transition-all duration-300 mx-auto ${isSticky ? 'search-soft-square w-[95%] max-w-4xl p-2 hidden md:flex' : 'search-soft-square w-[95%] max-w-4xl p-2 flex flex-col md:flex-row'}`; // Desktop Bar or Hero Block

  return (
    <>
      <form 
        onSubmit={(e) => {
          onSearch(e);
          setMobileExpanded(false); // Close overlay on search
        }} 
        className={containerClasses}
      >
        {/* Close Button for Mobile Overlay */}
        {mobileExpanded && (
          <button 
            type="button"
            onClick={() => setMobileExpanded(false)}
            className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Overlay Header */}
        {mobileExpanded && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Search Turfs</h2>
            <p className="text-slate-400 text-sm">Find the perfect pitch for your game.</p>
          </div>
        )}

        {/* --- FORM FIELDS --- */}
        <div className={`flex ${mobileExpanded ? 'flex-col gap-5' : 'flex-col md:flex-row items-center w-full gap-2 md:gap-0'}`}>
          
          {/* Location */}
          <div 
            ref={locationRef}
            className={`relative ${mobileExpanded ? 'w-full' : 'w-full md:flex-[1.5]'} px-3 py-2 group transition-colors rounded-lg ${activeField === 'location' || showLocationDropdown ? 'bg-slate-100 dark:bg-slate-700/50' : ''}`}
            onMouseEnter={() => !mobileExpanded && setActiveField('location')}
            onMouseLeave={() => !mobileExpanded && setActiveField(null)}
          > 
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Find a Field</label>
            <div className="flex items-center">
              <MapPin className={`w-5 h-5 text-emerald-500 mr-2 transition-transform duration-300 ${activeField === 'location' ? 'scale-110' : ''}`} />
              <input
                type="text"
                placeholder="Where are you playing?"
                className="compact-input truncate h-6 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base bg-transparent" 
                value={filters.location}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, location: e.target.value }));
                  setShowLocationDropdown(true);
                }}
                onFocus={() => {
                  setActiveField('location');
                  setShowLocationDropdown(true);
                }}
                autoComplete="off"
              />
            </div>
            {/* Dropdown Logic Same as before */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                {filteredLocations.length > 0 ? (
                  <ul>
                    {filteredLocations.map((loc) => (
                      <li key={loc}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center"
                          onClick={() => {
                            setFilters(prev => ({ ...prev, location: loc }));
                            setShowLocationDropdown(false);
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2.5 text-slate-400" />
                          {loc}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400 text-center">
                    No locations found
                  </div>
                )}
              </div>
            )}
            {mobileExpanded && <div className="mt-3 h-px w-full bg-slate-800"></div>}
          </div>

          {/* Divider (Desktop) */}
          {!mobileExpanded && <div className="hidden md:block compact-divider bg-slate-200 dark:bg-slate-700 h-8"></div>}

          {/* Sport */}
          <div 
            className={`relative ${mobileExpanded ? 'w-full' : 'w-full md:flex-[1.2]'} px-3 py-2 group rounded-lg ${activeField === 'sport' ? 'bg-slate-100 dark:bg-slate-700/50' : ''}`}
            onMouseEnter={() => !mobileExpanded && setActiveField('sport')}
            onMouseLeave={() => !mobileExpanded && setActiveField(null)}
          >
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Pick Your Sport</label>
            <div className="flex items-center relative">
              <Trophy className={`w-5 h-5 text-emerald-500 mr-2 transition-transform duration-300 ${activeField === 'sport' ? 'scale-110' : ''}`} />
              <select
                className="compact-input cursor-pointer bg-transparent appearance-none h-6 text-slate-800 dark:text-slate-200 w-full relative z-10 text-sm md:text-base [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white"
                value={filters.sport}
                onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
                onFocus={() => setActiveField('sport')}
                onBlur={() => setActiveField(null)}
              >
                <option value="">All Sports</option>
                <option value="Football">⚽ Football</option>
                <option value="Cricket">🏏 Cricket</option>
                <option value="Badminton">🏸 Badminton</option>
                <option value="Tennis">🎾 Tennis</option>
              </select>
              <ChevronDown className="absolute right-0 w-4 h-4 text-slate-300 pointer-events-none" />
            </div>
            {mobileExpanded && <div className="mt-3 h-px w-full bg-slate-800"></div>}
          </div>

          {/* Divider (Desktop) */}
          {!mobileExpanded && <div className="hidden md:block compact-divider bg-slate-200 dark:bg-slate-700 h-8"></div>}

          {/* Date */}
          <div 
            className={`relative ${mobileExpanded ? 'w-full' : 'w-full md:flex-[1.2]'} px-3 py-2 group rounded-lg ${activeField === 'date' || showCalendar ? 'bg-slate-100 dark:bg-slate-700/50' : ''}`}
            onMouseEnter={() => !mobileExpanded && setActiveField('date')}
            onMouseLeave={() => !mobileExpanded && setActiveField(null)}
            ref={calendarRef}
          >
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Choose Date</label>
            <div className="flex items-center">
              <Calendar className={`w-5 h-5 text-emerald-500 mr-2 transition-transform duration-300 ${activeField === 'date' || showCalendar ? 'scale-110' : ''}`} />
              <input
                type="text"
                readOnly
                placeholder="Select Date"
                className="compact-input cursor-pointer h-6 text-slate-800 dark:text-slate-200 bg-transparent text-sm md:text-base"
                value={getDisplayDate(filters.date)}
                onClick={() => setShowCalendar(true)}
                onFocus={() => {
                  setActiveField('date');
                  setShowCalendar(true);
                }}
              />
            </div>
            {showCalendar && (
              <CustomCalendar 
                selectedDate={filters.date} 
                onSelect={(date) => setFilters(prev => ({ ...prev, date }))}
                onClose={() => setShowCalendar(false)}
              />
            )}
            {mobileExpanded && <div className="mt-3 h-px w-full bg-slate-800"></div>}
          </div>

          {/* Search Button */}
          <div className={`${mobileExpanded ? 'w-full mt-6' : 'flex-shrink-0 ml-2 mr-0.5 w-full md:w-auto mt-2 md:mt-0'}`}>
            <button
              type="submit"
              className={`
                transition-all duration-300 flex items-center justify-center
                ${mobileExpanded 
                    ? 'btn-primary w-full py-4 rounded-xl shadow-lg text-white font-bold text-lg' 
                    : 'btn-square-search w-full md:w-11 h-11 md:h-11 rounded-xl font-bold text-white bg-emerald-500 hover:scale-105 active:scale-95'
                }
              `}
              title="Search Turfs"
            >
              <Search className={`${mobileExpanded ? 'h-6 w-6' : 'h-5 w-5 md:h-6 md:w-6 text-white'}`} />
              {/* Text only visible on mobile hero static view or expanded */}
              {!mobileExpanded && <span className="ml-2 md:hidden">Search Availability</span>}
              {mobileExpanded && <span className="ml-2">Search Now</span>}
            </button>
          </div>
        </div>
      </form>
      
      {/* Mobile Backdrop for Expanded State */}
      {mobileExpanded && (
        <div 
            className="fixed inset-0 bg-black/80 z-[90] backdrop-blur-sm"
            onClick={() => setMobileExpanded(false)}
        />
      )}
    </>
  );
};

// Helper for Gradient Title
const renderHeroTitle = (title: string) => {
    const words = title.split(' ');
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">{lastWord}</span>
      </>
    );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { turfs } = useData();
  const [filters, setFilters] = useState({
    location: '',
    sport: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });
  
  const [isSticky, setIsSticky] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) { // Trigger sticky a bit earlier
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/turfs', { state: filters });
  };

  const featuredTurfs = turfs.slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 relative min-h-screen transition-colors duration-300">
      
      {/* 1. Hero Slider (Full Width) */}
      <div className="relative h-[70vh] min-h-[550px] flex flex-col justify-center items-center overflow-hidden bg-slate-900">
        {HERO_SLIDES.map((slide, index) => (
            <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
                <img 
                    src={slide.image}
                    alt="Turfly Hero"
                    className="w-full h-full object-cover"
                />
                {/* Overlay: Slightly darker in dark mode if desired, but 50% is standard */}
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 backdrop-blur-sm tracking-widest uppercase shadow-lg">
                        DEW-DROP TURFS
                    </span>
                    {/* H1 Updated to Static Headline for Clarity */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[0.9] drop-shadow-lg">
                        Book Your Game, <br />
                        Play Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">Pro</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                        The easiest way to find and book premium sports turfs near you. Real-time slots, instant confirmation.
                    </p>
                </div>
            </div>
        ))}
      </div>

      {/* 2. Search Widget (Floating over Hero) */}
      {/* Reduced negative margin for compactness on mobile */}
      <div className="relative z-40 -mt-20 md:-mt-24 px-4 flex justify-center w-full">
        <SearchForm filters={filters} setFilters={setFilters} onSearch={handleSearch} />
      </div>

      {/* Sticky Widget Container */}
      {/* Only renders on Desktop as standard bar. On Mobile, SearchForm handles the 'Pill' logic internally via isSticky prop */}
      <div className="relative z-50">
        {isSticky && <div className="h-0" />} 
        <div className={`
          mx-auto transition-all duration-500 ease-in-out
          ${isSticky 
            ? 'sticky-search-container' 
            : 'opacity-0 pointer-events-none h-0'
          }
        `}>
             <SearchForm filters={filters} setFilters={setFilters} onSearch={handleSearch} isSticky={true} />
        </div>
      </div>

      {/* 3. Split Section: How It Works & Why Choose Turfly */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 reveal-on-scroll">
         <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* Left Column: How It Works */}
            <div className="flex-1 bg-white dark:bg-slate-900/50 dark:backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-[#10B981]/30 shadow-sm transition-colors">
               {/* H2 Updated with Midnight Pro Styling */}
               <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 pl-4 border-l-4 border-emerald-500 tracking-tight">How It Works</h2>
               <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <SearchIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">1. Search</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">
                          Find <span className="text-emerald-600 dark:text-emerald-400 font-medium">turfs</span> by location and sport. Filter by amenities and price.
                        </p>
                     </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <CalendarCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">2. Select Slot</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">
                           Choose your preferred date and time <span className="text-emerald-600 dark:text-emerald-400 font-medium">(AM/PM)</span>. View real-time availability.
                        </p>
                     </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <PlayCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">3. Confirm</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">
                           Pay and get instant <span className="text-emerald-600 dark:text-emerald-400 font-medium">booking</span> details sent to your dashboard.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Why Choose Turfly */}
            <div className="flex-1 bg-white dark:bg-slate-900/50 dark:backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-[#10B981]/30 shadow-sm transition-colors">
               {/* H2 Updated with Midnight Pro Styling */}
               <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 pl-4 border-l-4 border-emerald-500 tracking-tight">Why Choose Turfly?</h2>
               <div className="space-y-8">
                  {/* Benefit 1 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Instant Booking</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">No more phone calls or waiting. See availability and book in seconds.</p>
                     </div>
                  </div>
                  {/* Benefit 2 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Verified Turfs</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">Every turf is physically verified for quality, amenities, and safety standards.</p>
                     </div>
                  </div>
                  {/* Benefit 3 */}
                  <div className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        <Headphones className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">24/7 Support</h4>
                        <p className="text-slate-500 dark:text-slate-200 mt-1 leading-relaxed">Got an issue? Our dedicated support team is available around the clock.</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 4. Featured Arenas */}
      <section className="bg-white dark:bg-slate-800 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-100 dark:border-slate-700 reveal-on-scroll transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase text-sm">Premium Venues</span>
              {/* H2 Updated */}
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight pl-4 border-l-4 border-emerald-500">Featured Arenas</h2>
            </div>
            <button 
              onClick={() => navigate('/turfs')}
              className="hidden md:flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
            >
              View all turfs <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTurfs.map((turf) => (
              <div 
                key={turf.id} 
                className="premium-card group cursor-pointer overflow-hidden flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-700" 
                onClick={() => navigate(`/turfs/${turf.id}`)}
              >
                <div className="aspect-video w-full relative overflow-hidden">
                  <img 
                    src={turf.images[0]} 
                    alt={turf.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-800 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-emerald-900">
                      {turf.sport}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700">
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider mr-1">From</span>
                        <span className="text-white font-bold">৳{turf.pricePerHour}/hr</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{turf.name}</h3>
                    <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-900/50">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mb-6">
                    <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" /> {turf.location}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex gap-2">
                      {turf.amenities.slice(0, 2).map(am => (
                          <span key={am} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{am}</span>
                      ))}
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm border border-emerald-100 dark:border-emerald-800/50 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:text-white transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => navigate('/turfs')}
              className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-semibold bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Browse All Turfs
            </button>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto reveal-on-scroll">
        {/* H2 Updated */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16 tracking-tight">What Players Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {TESTIMONIALS.map((t, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative transition-colors">
                <Quote className="w-10 h-10 text-emerald-100 dark:text-emerald-900/50 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                     <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 6. Partner CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 reveal-on-scroll">
         <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
             {/* Decorative Circles */}
             <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Own a Turf?</h2>
                <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  List your sports facility on Turfly and reach thousands of players instantly. Manage bookings, track revenue, and grow your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg">
                    Become a Partner
                  </button>
                  <button className="px-8 py-4 bg-emerald-700/50 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors border border-emerald-600 backdrop-blur-sm">
                    Learn More
                  </button>
                </div>
             </div>
         </div>
      </section>

    </div>
  );
};

export default Home;