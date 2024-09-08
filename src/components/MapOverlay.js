import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ["places"];

const MapOverlay = ({ onLocationSelected }) => {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got user location:", position.coords);
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Fallback to a default location (e.g., New York City)
          setCenter({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location
      setCenter({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  };

  const onMapClick = useCallback((event) => {
    setCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, []);

  const handleConfirm = () => {
    console.log("Confirming location:", center);
    onLocationSelected(center);
  };

  if (!center) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          onClick={onMapClick}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      <button 
        onClick={handleConfirm}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          padding: '10px 20px',
          fontSize: '16px'
        }}
      >
        Confirm Location
      </button>
    </div>
  );
};

export default MapOverlay;
