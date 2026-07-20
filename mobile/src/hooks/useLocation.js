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
    (async () => {
      if (!Location) {
        setErrorMsg('Location services not available');
        setLoading(false);
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
      } catch (_error) {
        try {
          let lastKnown = await Location.getLastKnownPositionAsync({});
          if (lastKnown) {
            setLocation(lastKnown);
          } else {
            setErrorMsg('Could not fetch location');
          }
        } catch (_innerError) {
          setErrorMsg('Could not fetch location');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, errorMsg, loading };
};
