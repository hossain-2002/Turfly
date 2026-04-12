import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { Turf } from '@/types/index';
import { calculateDistance } from '@/utils/geoUtils';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Turf marker (red)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User marker (green)
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle flyTo and bounds fitting
const MapController: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  turfs: Turf[];
  isZoomedToUser: boolean;
  onMapReady: (defaultCenter: [number, number], defaultZoom: number) => void;
  toggleGoToMyLocation: (() => void) | null;
}> = ({ userLocation, turfs, isZoomedToUser, onMapReady, toggleGoToMyLocation }) => {
  const map = useMap();
  const hasFlyedRef = useRef(false);
  const defaultCenterRef = useRef<[number, number] | null>(null);
  const defaultZoomRef = useRef<number>(12);

  useEffect(() => {
    if (userLocation && !hasFlyedRef.current) {
      hasFlyedRef.current = true;
      // Fly to user location smoothly
      map.flyTo([userLocation.lat, userLocation.lng], 13, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [userLocation, map]);

  // Fit bounds to show all markers when no user location
  useEffect(() => {
    if (!userLocation && turfs.length > 0) {
      const coords = turfs
        .filter((t) => t.coordinates)
        .map((t) => [t.coordinates!.lat, t.coordinates!.lng] as [number, number]);
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [turfs, userLocation, map]);

  // Store initial map state and notify parent
  useEffect(() => {
    if (defaultCenterRef.current === null) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      defaultCenterRef.current = [center.lat, center.lng];
      defaultZoomRef.current = zoom;
      onMapReady([center.lat, center.lng], zoom);
    }
  }, [map, onMapReady]);

  // Handle toggle from parent
  useEffect(() => {
    if (!toggleGoToMyLocation) return;
    
    if (isZoomedToUser && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else if (!isZoomedToUser && defaultCenterRef.current) {
      map.flyTo(defaultCenterRef.current, defaultZoomRef.current, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [isZoomedToUser, userLocation, map, toggleGoToMyLocation]);

  return null;
};

interface NearbyTurfsMapProps {
  turfs: Turf[];
  userLocation: { lat: number; lng: number } | null;
}

const NearbyTurfsMap: React.FC<NearbyTurfsMapProps> = ({ turfs, userLocation }) => {
  // Default center: Dhaka city center
  const defaultCenter: [number, number] = [23.7806, 90.3993];
  const center = userLocation
    ? [userLocation.lat, userLocation.lng] as [number, number]
    : defaultCenter;

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      {/* User location indicator overlay */}
      {userLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-md">
              <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Location</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Live • Nearby turfs shown</p>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full min-h-[350px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController userLocation={userLocation} turfs={turfs} />

        {/* User Marker (Green) */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={greenIcon}>
            <Popup className="font-sans">
              <div className="text-center p-1">
                <strong className="block text-slate-800 text-base mb-1">📍 You are here</strong>
                <span className="text-xs text-slate-500">Current Location</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Turf Markers (Red) */}
        {turfs.map((turf) => {
          if (!turf.coordinates) return null;
          const dist = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, turf.coordinates.lat, turf.coordinates.lng)
            : null;

          return (
            <Marker
              key={turf.id}
              position={[turf.coordinates.lat, turf.coordinates.lng]}
              icon={redIcon}
            >
              <Popup className="font-sans">
                <div className="text-center p-1 min-w-[140px]">
                  <strong className="block text-slate-800 text-base mb-1">{turf.name}</strong>
                  <span className="text-xs text-slate-500 block">{turf.location}</span>
                  {dist !== null && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      {dist} km away
                    </span>
                  )}
                  <span className="block mt-1 text-xs font-semibold text-emerald-600">৳{turf.pricePerHour}/hr</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default NearbyTurfsMap;
