import React, { useState } from 'react';
import RestaurantSearch from './components/RestaurantSearch';
import { LoadScript } from '@react-google-maps/api';
import './App.css';

const libraries = ["places"];

function App() {
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [randomPick, setRandomPick] = useState(null);

  const addRestaurant = (restaurant) => {
    setSelectedRestaurants(prev => {
      if (!prev.find(r => r.place_id === restaurant.place_id)) {
        return [...prev, restaurant];
      }
      return prev;
    });
  };

  const removeRestaurant = (placeId) => {
    setSelectedRestaurants(prev => prev.filter(r => r.place_id !== placeId));
  };

  const pickRandom = () => {
    if (selectedRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedRestaurants.length);
      setRandomPick(selectedRestaurants[randomIndex]);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="App">
        <h1>Restaurant Picker</h1>
        <div className="container">
          <div className="column">
            <h2>Nearby Restaurants</h2>
            <RestaurantSearch addRestaurant={addRestaurant} />
          </div>
          <div className="column">
            <h2>Your Selected Restaurants</h2>
            <div className="restaurant-list">
              {selectedRestaurants.map(restaurant => (
                <div key={restaurant.place_id} className="restaurant-item">
                  <div className="restaurant-name">{restaurant.name}</div>
                  <button className="remove-button" onClick={() => removeRestaurant(restaurant.place_id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
          <div className="column">
            <h2>Random Pick</h2>
            <div className="random-pick">
              <button onClick={pickRandom} disabled={selectedRestaurants.length === 0}>
                Pick Random Restaurant
              </button>
              {randomPick && (
                <div>
                  <h3>Selected:</h3>
                  <p>{randomPick.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

export default App;
