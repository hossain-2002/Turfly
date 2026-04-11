import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MapPin, Navigation } from 'lucide-react';
import { calculateDistance } from '@/utils/geoUtils';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface TurfMapProps {
    turfLocation: { lat: number; lng: number };
    turfName: string;
}

const TurfMap: React.FC<TurfMapProps> = ({ turfLocation, turfName }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // ref to the underlying Leaflet map instance
    const mapRef = useRef<L.Map | null>(null);
    // ref to the routing control so we can remove/re-add it
    const routingRef = useRef<L.Routing.Control | null>(null);

    // Get user geolocation once
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setErrorMsg('Geolocation not supported by this browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setUserLocation({ lat, lng });
                setDistance(calculateDistance(lat, lng, turfLocation.lat, turfLocation.lng));
            },
            (err) => {
                console.warn('Geolocation error:', err.message);
                setErrorMsg('Could not get your location.');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, [turfLocation]);

    // Add / update routing control whenever map or userLocation changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !userLocation) return;

        // Remove previous routing control if any
        if (routingRef.current) {
            map.removeControl(routingRef.current);
            routingRef.current = null;
        }

        const control = (L.Routing as any).control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(turfLocation.lat, turfLocation.lng),
            ],
            createMarker: () => null,   // suppress default routing waypoint markers
            lineOptions: {
                styles: [{ color: '#3b82f6', weight: 5, opacity: 0.85 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            collapsible: false,
        });

        // Hide the instruction panel container once the route is found
        control.on('routesfound', () => {
            const el: HTMLElement | undefined = control.getContainer?.();
            if (el) el.style.display = 'none';
        });

        control.addTo(map);
        routingRef.current = control;

        return () => {
            if (routingRef.current) {
                map.removeControl(routingRef.current);
                routingRef.current = null;
            }
        };
    }, [userLocation, turfLocation]);

    const mapCenter = userLocation
        ? { lat: (userLocation.lat + turfLocation.lat) / 2, lng: (userLocation.lng + turfLocation.lng) / 2 }
        : turfLocation;

    return (
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-slate-700 bg-slate-800">

            {/* Distance overlay */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg p-3 shadow-xl">
                {distance !== null ? (
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-md">
                            <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Distance from you</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{distance} km away</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-md">
                            <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Location</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{errorMsg || 'Getting location...'}</p>
                        </div>
                    </div>
                )}
            </div>

            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full min-h-[400px] w-full z-0"
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Turf Marker (Red) */}
                <Marker position={[turfLocation.lat, turfLocation.lng]} icon={redIcon}>
                    <Popup className="font-sans">
                        <div className="text-center p-1">
                            <strong className="block text-slate-800 text-base mb-1">{turfName}</strong>
                            <span className="text-xs text-slate-500">Destination</span>
                        </div>
                    </Popup>
                </Marker>

                {/* User Marker (Blue) — only when location is known */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
                        <Popup className="font-sans">
                            <div className="text-center p-1">
                                <strong className="block text-slate-800 text-base mb-1">You are here</strong>
                                <span className="text-xs text-slate-500">Current Location</span>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default TurfMap;
