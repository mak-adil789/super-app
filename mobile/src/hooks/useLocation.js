import { useState, useEffect } from 'react';

let Location;
try {
  Location = require('expo-location');
} catch (e) {
  console.warn('expo-location not found:', e.message);
}

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Location) {
      setErrorMsg('Location services not available');
      setLoading(false);
      return;
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (_error) {
        setErrorMsg('Could not fetch location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, errorMsg, loading };
};
