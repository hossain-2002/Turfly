import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MapPin, Filter, Calendar, Trophy } from 'lucide-react';

const TurfList: React.FC = () => {
  const { turfs } = useData();
  const location = useLocation();
  const locationState = location.state as { location?: string; sport?: string; date?: string } | null;
  
  const [filters, setFilters] = useState({
    location: locationState?.location || '',
    sport: locationState?.sport || '',
    date: locationState?.date || new Date().toISOString().split('T')[0]
  });

  // Effect to update filters if location state changes (e.g. from Home nav)
  useEffect(() => {
    if (locationState) {
      setFilters(prev => ({
        ...prev,
        location: locationState.location || prev.location,
        sport: locationState.sport || prev.sport,
        date: locationState.date || prev.date
      }));
    }
  }, [locationState]);

  const filteredTurfs = turfs.filter(turf => {
    const matchesLoc = turf.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSport = !filters.sport || turf.sport === filters.sport;
    return matchesLoc && matchesSport;
  });

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Search Widget Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8 transition-colors">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 pl-4 border-l-4 border-emerald-500 tracking-tight">Find your perfect turf</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Location (e.g. Mirpur)"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Trophy className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none transition-shadow"
              value={filters.sport}
              onChange={(e) => setFilters(prev => ({...prev, sport: e.target.value}))}
            >
              <option value="">All Sports</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Badminton">Badminton</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
              value={filters.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFilters(prev => ({...prev, date: e.target.value}))}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {filteredTurfs.length} {filteredTurfs.length === 1 ? 'Turf' : 'Turfs'} Available
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Link key={turf.id} to={`/turfs/${turf.id}`} state={{ selectedDate: filters.date }} className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col premium-card">
              <div className="aspect-video w-full bg-gray-200 relative overflow-hidden">
                <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm">
                  {turf.sport}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{turf.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {turf.location}
                  </p>
                  <div className="mt-4 flex items-center flex-wrap gap-2">
                    {turf.amenities.slice(0, 3).map(am => (
                      <span key={am} className="px-2 py-1 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md border border-gray-100 dark:border-slate-600">{am}</span>
                    ))}
                    {turf.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md border border-gray-100 dark:border-slate-600">+{turf.amenities.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-slate-400">Price per hour</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">৳{turf.pricePerHour}</span>
                  </div>
                  <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 group-hover:bg-primary-700 transition-colors shadow-sm">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
           <div className="col-span-full text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-700 mb-4">
               <Filter className="h-6 w-6 text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">No turfs found</h3>
             <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Try adjusting your search filters to find what you're looking for.</p>
             <button 
                onClick={() => setFilters({ location: '', sport: '', date: new Date().toISOString().split('T')[0] })}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
             >
               Clear all filters
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default TurfList;