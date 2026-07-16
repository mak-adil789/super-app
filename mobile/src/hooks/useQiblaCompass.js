import { useState, useEffect, useMemo } from 'react';

let Magnetometer;
try {
  Magnetometer = require('expo-sensors').Magnetometer;
} catch (e) {
  console.warn('expo-sensors not found:', e.message);
}

const KAABA_COORDS = {
  latitude: 21.4225,
  longitude: 39.8262,
};

const calculateQiblaDirection = (lat, lon) => {
  const phiK = KAABA_COORDS.latitude * (Math.PI / 180);
  const lambdaK = KAABA_COORDS.longitude * (Math.PI / 180);
  const phiL = lat * (Math.PI / 180);
  const lambdaL = lon * (Math.PI / 180);
  const deltaLambda = lambdaK - lambdaL;

  const yVal = Math.sin(deltaLambda);
  const xVal = Math.cos(phiL) * Math.tan(phiK) - Math.sin(phiL) * Math.cos(deltaLambda);
  let q = Math.atan2(yVal, xVal) * (180 / Math.PI);

  return (q + 360) % 360;
};

const calculateHeadingFromData = (data) => {
  let { x, y } = data;
  let head = 0;
  if (Math.atan2(y, x) >= 0) {
    head = Math.atan2(y, x) * (180 / Math.PI);
  } else {
    head = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
  }
  return Math.round(head);
};

export const useQiblaCompass = (userLatitude, userLongitude) => {
  const [heading, setHeading] = useState(0);

  const qiblaDirection = useMemo(() => {
    if (userLatitude && userLongitude) {
      return calculateQiblaDirection(userLatitude, userLongitude);
    }
    return 0;
  }, [userLatitude, userLongitude]);

  useEffect(() => {
    if (!Magnetometer) return;
    let subscription = null;

    const _subscribe = () => {
      subscription = Magnetometer.addListener((data) => {
        setHeading(calculateHeadingFromData(data));
      });
      Magnetometer.setUpdateInterval(100);
    };

    _subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { heading, qiblaDirection };
};
