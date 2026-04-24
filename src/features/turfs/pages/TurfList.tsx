import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { MapPin, Filter, Calendar, Trophy, LocateFixed, Loader2, Map, Navigation, X } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { calculateDistance } from '@/utils/geoUtils';
import NearbyTurfsMap from '@/features/turfs/components/NearbyTurfsMap';
import { Turf } from '@/types/index';

// Radius filter options
const RADIUS_OPTIONS = [
  { label: 'All Turfs', value: 0 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 20 km', value: 20 },
];

// Extend Turf with computed distance
interface TurfWithDistance extends Turf {
  distance: number | null;
}

const TurfList: React.FC = () => {
  const { turfs } = useData();
  const location = useLocation();
  const locationState = location.state as { location?: string; sport?: string; date?: string } | null;

  const [filters, setFilters] = useState({
    location: locationState?.location || '',
    sport: locationState?.sport || '',
    date: locationState?.date || new Date().toISOString().split('T')[0],
    minPrice: '',
    maxPrice: '',
  });

  const [radiusKm, setRadiusKm] = useState(0); // 0 = All
  const [showMap, setShowMap] = useState(false);

  // Geolocation hook
  const { userLocation, loading: geoLoading, error: geoError, requestLocation } = useUserLocation();

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

  // Compute turfs with distance
  const turfsWithDistance: TurfWithDistance[] = useMemo(() => {
    return turfs.map(turf => {
      let distance: number | null = null;
      if (userLocation && turf.coordinates) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          turf.coordinates.lat,
          turf.coordinates.lng
        );
      }
      return { ...turf, distance };
    });
  }, [turfs, userLocation]);

  // Filter + sort
  const filteredTurfs = useMemo(() => {
    let result = turfsWithDistance.filter(turf => {
      const matchesLoc = turf.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesSport = !filters.sport || turf.sport === filters.sport;
      const matchesMin = !filters.minPrice || turf.pricePerHour >= Number(filters.minPrice);
      const matchesMax = !filters.maxPrice || turf.pricePerHour <= Number(filters.maxPrice);

      // Radius filter
      let matchesRadius = true;
      if (radiusKm > 0 && userLocation) {
        matchesRadius = turf.distance !== null && turf.distance <= radiusKm;
      }

      return matchesLoc && matchesSport && matchesMin && matchesMax && matchesRadius;
    });

    // Sort by distance if user location is available
    if (userLocation) {
      result.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return result;
  }, [turfsWithDistance, filters, radiusKm, userLocation]);

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Search Widget Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white pl-4 border-l-4 border-emerald-500 tracking-tight">Find your perfect turf</h2>
          
          {/* Locate Me Button */}
          <button
            id="locate-me-btn"
            onClick={requestLocation}
            disabled={geoLoading}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
              ${userLocation
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                : geoLoading
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 border border-transparent'
              }
            `}
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : userLocation ? (
              <LocateFixed className="w-4 h-4" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            {geoLoading ? 'Locating...' : userLocation ? 'Location Active' : 'Locate Me'}
          </button>
        </div>

        {/* Geo Error Message */}
        {geoError && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 animate-fade-in">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {geoError}
          </div>
        )}

        {/* Sorted-by-nearest indicator */}
        {userLocation && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-fade-in">
            <Navigation className="w-4 h-4" />
            <span className="font-medium">Sorted by nearest to you</span>
            {radiusKm > 0 && <span className="text-xs opacity-75">• Showing within {radiusKm} km</span>}
          </div>
        )}

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
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Trophy className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none transition-shadow"
              value={filters.sport}
              onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
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
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>

        {/* Price Range + Radius Filter Row */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Price / Hour (৳):</span>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="number"
              placeholder="Min"
              min={0}
              className="w-28 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              className="w-28 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
            {(filters.minPrice || filters.maxPrice) && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Radius Filter — only visible when location is active */}
          {userLocation && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Radius:</span>
              <select
                id="radius-filter"
                className="px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-lg text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
              >
                {RADIUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Map Toggle + Map Section */}
      <div className="mb-8">
        <button
          id="toggle-map-btn"
          onClick={() => setShowMap(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 mb-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
        >
          {showMap ? <X className="w-4 h-4" /> : <Map className="w-4 h-4" />}
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <div className="animate-fade-in">
            <NearbyTurfsMap turfs={filteredTurfs} userLocation={userLocation} />
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {filteredTurfs.length} {filteredTurfs.length === 1 ? 'Turf' : 'Turfs'} Available
        </h1>
      </div>

      {/* Turf Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Link key={turf.id} to={`/turfs/${turf.id}`} state={{ selectedDate: filters.date }} className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col premium-card">
              <div className="aspect-video w-full bg-gray-200 relative overflow-hidden">
                <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm">
                  {turf.sport}
                </div>
                {/* Distance Badge */}
                {turf.distance !== null && (
                  <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-md flex items-center gap-1 animate-fade-in">
                    <Navigation className="w-3 h-3" />
                    {turf.distance} km
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{turf.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {turf.location}
                    {/* Inline distance text */}
                    {turf.distance !== null && (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                        • {turf.distance} km away
                      </span>
                    )}
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
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {radiusKm > 0 && userLocation
                ? `No turfs found within ${radiusKm} km. Try increasing the radius.`
                : 'Try adjusting your search filters to find what you\'re looking for.'}
            </p>
            <button
              onClick={() => {
                setFilters({ location: '', sport: '', date: new Date().toISOString().split('T')[0], minPrice: '', maxPrice: '' });
                setRadiusKm(0);
              }}
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