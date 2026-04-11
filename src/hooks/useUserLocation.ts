import { useState, useCallback } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

interface UseUserLocationReturn {
  userLocation: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

/**
 * Custom hook to get the user's current geolocation.
 * Location is only requested when `requestLocation()` is called (button-triggered).
 */
export const useUserLocation = (): UseUserLocationReturn => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ lat, lng });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable it in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Could not get your location.');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { userLocation, loading, error, requestLocation };
};
