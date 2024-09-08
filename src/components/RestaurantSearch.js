import React, { useState, useEffect, useCallback } from 'react';
import RestaurantList from './RestaurantList';

const RestaurantSearch = ({ addRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5000); // Default radius of 5km

  useEffect(() => {
    console.log("Attempting to get user location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location obtained:", position.coords);
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Failed to get user location. Using default.");
          setCenter({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation not supported. Using default location.");
      setCenter({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
    }
  }, []);

  const findNearbyRestaurants = useCallback(() => {
    console.log("Finding nearby restaurants...");
    if (window.google && window.google.maps && window.google.maps.places && center) {
      console.log("Google Maps API is available");
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: radius.toString(),
        type: ['restaurant']
      };

      console.log("Sending request:", request);

      service.nearbySearch(request, (results, status) => {
        console.log("Received response. Status:", status);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log("Restaurants found:", results.length);
          setRestaurants(results);
        } else {
          console.error("Error finding restaurants:", status);
          setError("Failed to find nearby restaurants.");
          setRestaurants([]);
        }
      });
    } else {
      console.error("Google Maps API not available or center not set");
      setError("Google Maps API not available or location not set.");
    }
  }, [center, radius]);

  useEffect(() => {
    if (center) {
      console.log("Center changed, finding restaurants");
      findNearbyRestaurants();
    }
  }, [center, findNearbyRestaurants]);

  const handleZoomIn = () => {
    setRadius(prevRadius => Math.max(prevRadius / 2, 500));
  };

  const handleZoomOut = () => {
    setRadius(prevRadius => Math.min(prevRadius * 2, 50000));
  };

  if (!center) {
    return <div>Loading... Please allow location access if prompted.</div>;
  }

  return (
    <div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>-</button>
        <span className="radius-display">Search Radius: {radius / 1000} km</span>
        <button onClick={handleZoomOut}>+</button>
      </div>
      <RestaurantList restaurants={restaurants} addRestaurant={addRestaurant} />
    </div>
  );
};

export default RestaurantSearch;
