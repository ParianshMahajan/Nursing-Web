import React, { useState } from 'react';
import Map from './Map';

const Location = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(position.coords);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };


  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
    

  return (
    <div>
      <button onClick={getLocation}>Get Position</button>
      {error && <div>{error}</div>}
      {position && (
        <>
            <pre>
              latitude: {position.latitude}
              longitude: {position.longitude}
            </pre>
            <Map latitude={position.latitude} longitude={position.longitude} />
        </>
      )}

        
    </div>
  );
};

export default Location;
