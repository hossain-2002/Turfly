import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Loader2, MapPinOff, LocateFixed, Map } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { calculateDistance } from '@/utils/geoUtils';
import { Turf } from '@/types/index';

interface MapErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep app alive if map internals fail at runtime.
    console.error('❌ NearbyTurfsSection Map Error:', error);
    console.error('Error Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── Default center: Dhaka ────────────────────────────────────────
const DHAKA_CENTER: [number, number] = [23.7806, 90.3993];

// ─── localStorage cache key & TTL (30 minutes) ───────────────────
const GEO_CACHE_KEY = 'turfly_user_geo';
const GEO_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedGeo {
  lat: number;
  lng: number;
  timestamp: number;
}

/** Read cached location. Returns null if missing or expired. */
const getCachedLocation = (): { lat: number; lng: number } | null => {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const data: CachedGeo = JSON.parse(raw);
    if (Date.now() - data.timestamp > GEO_TTL_MS) {
      localStorage.removeItem(GEO_CACHE_KEY);
      return null;
    }
    return { lat: data.lat, lng: data.lng };
  } catch {
    return null;
  }
};

/** Persist location with current timestamp. */
const setCachedLocation = (lat: number, lng: number) => {
  const data: CachedGeo = { lat, lng, timestamp: Date.now() };
  localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(data));
};

// ─── Custom blue pulsing user marker ──────────────────────────────
const userPulseIcon = L.divIcon({
  className: '',
  html: `<div class="user-pulse-marker">
           <div class="user-pulse-core"></div>
           <div class="user-pulse-ring"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -16],
});

// ─── Circular DivIcon builder for turf markers ────────────────────
const createTurfIcon = (imageUrl: string) =>
  L.divIcon({
    className: '',
    html: `<div class="turf-circle-marker cursor-pointer">
             <img src="${imageUrl}" alt="turf" />
           </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26],
  });

// ─── MapController: imperative flyTo / fitBounds ──────────────────
const MapController: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  nearbyTurfs: Turf[];
}> = ({ userLocation, nearbyTurfs }) => {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (hasFlown.current) return;

    // Safety check: ensure map is valid before executing
    if (!map) {
      console.warn('⚠️ Map instance not available yet');
      return;
    }

    if (userLocation && nearbyTurfs.length > 0) {
      try {
        hasFlown.current = true;
        const points: [number, number][] = [
          [userLocation.lat, userLocation.lng],
          ...nearbyTurfs
            .filter((t) => t.coordinates)
            .map((t) => [t.coordinates!.lat, t.coordinates!.lng] as [number, number]),
        ];
        const bounds = L.latLngBounds(points);
        map.flyToBounds(bounds, { padding: [60, 60], duration: 1.6, maxZoom: 14 });
        console.log('✅ Map flew to bounds with user + turfs');
      } catch (error) {
        console.error('❌ Error flying to bounds:', error);
      }
    } else if (userLocation) {
      try {
        hasFlown.current = true;
        map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.6 });
        console.log('✅ Map flew to user location only');
      } catch (error) {
        console.error('❌ Error flying to user location:', error);
      }
    }
  }, [userLocation, nearbyTurfs, map]);

  return null;
};

// ─── LocateMeControl: button inside the map ───────────────────────
const LocateMeControl: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  turfMarkersBounds: L.LatLngBounds | null;
}> = ({ userLocation, turfMarkersBounds }) => {
  const map = useMap();
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const handleClick = useCallback(() => {
    if (!userLocation) {
      console.warn('⚠️ User location not available');
      return;
    }

    if (!map) {
      console.warn('⚠️ Map instance not available');
      return;
    }

    if (!isZoomedIn) {
      try {
        map.flyTo([userLocation.lat, userLocation.lng], 16, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        setIsZoomedIn(true);
        console.log('✅ Zoomed to user location');
      } catch (error) {
        console.error('❌ Error zooming to user location:', error);
      }
      return;
    }

    if (turfMarkersBounds && turfMarkersBounds.isValid()) {
      try {
        map.fitBounds(turfMarkersBounds, {
          padding: [60, 60],
          duration: 1.2,
          easeLinearity: 0.25,
          maxZoom: 14,
          animate: true,
        });
        console.log('✅ View fitted to turf bounds');
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    } else {
      try {
        map.flyTo(DHAKA_CENTER, 12, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        console.log('✅ Returned to default center');
      } catch (error) {
        console.error('❌ Error flying to center:', error);
      }
    }

    setIsZoomedIn(false);
  }, [isZoomedIn, map, turfMarkersBounds, userLocation]);

  if (!userLocation) return null;

  return (
    <div className="absolute bottom-5 right-4 z-[1000]">
      <button
        onClick={handleClick}
        title={isZoomedIn ? 'View all turfs' : 'Go to my location'}
        aria-pressed={isZoomedIn}
        className="
          h-10 px-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg
          border border-slate-200 dark:border-slate-600
          flex items-center justify-center
          gap-2
          hover:bg-slate-50 dark:hover:bg-slate-700
          hover:shadow-xl active:scale-95
          transition-all duration-200 cursor-pointer
        "
      >
        {isZoomedIn ? (
          <Map className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <LocateFixed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
        <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
          {isZoomedIn ? 'View All' : 'My Location'}
        </span>
      </button>
    </div>
  );
};

// ─── Popup "Book Now" button ──────────────────────────────────────
const BookNowPopup: React.FC<{ turf: Turf; distance: number | null }> = ({ turf, distance }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-1 min-w-[170px] font-sans">
      <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
        <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-0.5 leading-tight">{turf.name}</h4>
      <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
        <span>📍</span> {turf.location}
      </p>
      {distance !== null && (
        <span className="inline-block mb-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">
          {distance} km away
        </span>
      )}
      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="text-sm font-extrabold text-slate-800">৳{turf.pricePerHour}<span className="text-[10px] font-normal text-slate-400">/hr</span></span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/turfs/${turf.id}`);
          }}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm active:scale-95"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// ─── HoverMarker: opens popup on hover, closes on leave ───────────
const HoverMarker: React.FC<{
  turf: Turf & { distance: number | null };
  icon: L.DivIcon;
  distance: number | null;
}> = ({ turf, icon, distance }) => {
  const markerRef = useRef<L.Marker | null>(null);

  if (!turf.coordinates) return null;

  return (
    <Marker
      ref={markerRef}
      position={[turf.coordinates.lat, turf.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        mouseover: () => {
          markerRef.current?.openPopup();
        },
        mouseout: () => {
          setTimeout(() => {
            const popup = markerRef.current?.getPopup();
            const popupEl = popup?.getElement();
            if (popupEl && popupEl.matches(':hover')) return;
            markerRef.current?.closePopup();
          }, 200);
        },
      }}
    >
      <Popup className="font-sans nearby-turf-popup" maxWidth={220} minWidth={180}>
        <BookNowPopup turf={turf} distance={distance} />
      </Popup>
    </Marker>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────
const MapSkeleton: React.FC = () => (
  <div className="w-full h-[450px] rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse flex flex-col items-center justify-center gap-3 border border-slate-300 dark:border-slate-600">
    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Detecting your location…</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// ─── Main Component ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const NearbyTurfsSection: React.FC = () => {
  const { turfs } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // ── Initialize from cache (instant, no loader flash) ──
  const cached = getCachedLocation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(cached);
  const [geoStatus, setGeoStatus] = useState<'loading' | 'granted' | 'denied'>(
    cached ? 'granted' : 'loading'
  );

  // ── Auto-detect location on mount (skip if valid cache exists) ──
  useEffect(() => {
    // If we already have a cached location, no need to re-fetch
    if (getCachedLocation()) return;

    if (!('geolocation' in navigator)) {
      setGeoStatus('denied');
      showToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setGeoStatus('granted');
        setCachedLocation(loc.lat, loc.lng);
      },
      () => {
        setGeoStatus('denied');
        showToast('Showing popular turfs in your city.', 'info');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Compute turfs with distance, sorted nearest-first (memoized) ──
  const turfsWithDistance = useMemo(() => {
    return turfs
      .filter((t) => t.coordinates)
      .map((t) => ({
        ...t,
        distance: userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, t.coordinates!.lat, t.coordinates!.lng)
          : null,
      }))
      .sort((a, b) => {
        if (a.distance === null || b.distance === null) return 0;
        return a.distance - b.distance;
      });
  }, [turfs, userLocation]);

  // Nearest 4 for the map focus + quick cards
  const nearbyTurfs = useMemo(() => turfsWithDistance.slice(0, 4), [turfsWithDistance]);

  // Memoize marker icons to prevent re-creation on every render
  const markerIcons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    turfsWithDistance.forEach((turf) => {
      if (turf.images[0] && !map.has(turf.id)) {
        map.set(turf.id, createTurfIcon(turf.images[0]));
      }
    });
    return map;
  }, [turfsWithDistance]);

  // Stable mapCenter – only recompute when userLocation changes
  const mapCenter = useMemo<[number, number]>(
    () => (userLocation ? [userLocation.lat, userLocation.lng] : DHAKA_CENTER),
    [userLocation]
  );

  const turfMarkersBounds = useMemo(() => {
    const coordinates = turfsWithDistance
      .filter((turf) => turf.coordinates)
      .map((turf) => [turf.coordinates!.lat, turf.coordinates!.lng] as [number, number]);

    return coordinates.length > 0 ? L.latLngBounds(coordinates) : null;
  }, [turfsWithDistance]);

  return (
    <section id="nearby-turfs-section" className="py-16 px-4 sm:px-6 lg:px-8 reveal-on-scroll">
      <div className="max-w-7xl mx-auto">
        {/* ── Section Header — matches Featured Arenas style ── */}
        <div className="mb-12">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase text-sm">
            Live Location
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight pl-4 border-l-4 border-emerald-500">
            Ready to Play? Turfs Near You
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl text-sm md:text-base">
            We auto-detect your location to show the nearest sports turfs. Hover any marker to book instantly.
          </p>
        </div>

        {/* ── Map Area ── */}
        {geoStatus === 'loading' ? (
          <MapSkeleton />
        ) : (
          <div className="relative w-full h-[450px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
            {/* Denied-location inline badge */}
            {geoStatus === 'denied' && (
              <div className="absolute top-4 left-4 z-[1000] bg-amber-50 dark:bg-amber-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <MapPinOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Location denied — showing popular turfs
                </span>
              </div>
            )}

            {/* User-location live badge */}
            {geoStatus === 'granted' && (
              <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-md">
                    <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Location</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Live • {nearbyTurfs.length} turfs nearby</p>
                  </div>
                </div>
              </div>
            )}

            <MapErrorBoundary
              fallback={
                <div className="w-full h-full min-h-[450px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Map is temporarily unavailable.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please refresh to try loading nearby turfs again.</p>
                  </div>
                </div>
              }
            >
              <MapContainer
                center={mapCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="!h-[450px] md:!h-[500px] w-full z-0"
                style={{ 
                  height: '450px',
                  width: '100%',
                  minHeight: '450px',
                  display: 'block'
                }}
              >
                {/* CartoDB Voyager — cleaner, modern tile layer */}
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Locate Me button must stay inside MapContainer to use useMap safely. */}
                <LocateMeControl userLocation={userLocation} turfMarkersBounds={turfMarkersBounds} />

                <MapController userLocation={userLocation} nearbyTurfs={nearbyTurfs} />

                {/* ── User pulse marker ── */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userPulseIcon}>
                    <Popup className="font-sans">
                      <div className="text-center p-1">
                        <strong className="block text-slate-800 text-sm mb-0.5">📍 You are here</strong>
                        <span className="text-[11px] text-slate-500">Current Location</span>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* ── Turf circle markers — popup on hover ── */}
                {turfsWithDistance.map((turf) => {
                  if (!turf.coordinates) return null;
                  const icon = markerIcons.get(turf.id);
                  if (!icon) return null;

                  return (
                    <HoverMarker
                      key={turf.id}
                      turf={turf}
                      icon={icon}
                      distance={turf.distance}
                    />
                  );
                })}
              </MapContainer>
            </MapErrorBoundary>
          </div>
        )}

        {/* ── Nearest Turfs Quick Cards (below map) ── */}
        {geoStatus !== 'loading' && nearbyTurfs.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {nearbyTurfs.map((turf) => (
              <button
                key={turf.id}
                onClick={() => navigate(`/turfs/${turf.id}`)}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center gap-3 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 text-left active:scale-[0.97]"
              >
                <div className="w-11 h-11 rounded-full border-2 border-emerald-500 overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {turf.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {turf.location}
                    {turf.distance !== null && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-0.5"> · {turf.distance} km</span>
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyTurfsSection;
