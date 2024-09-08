import React from 'react';

const RestaurantList = ({ restaurants, addRestaurant }) => {
  return (
    <div className="restaurant-list">
      {restaurants.map(restaurant => (
        <div key={restaurant.place_id} className="restaurant-item">
          <div>
            <div className="restaurant-name">{restaurant.name}</div>
            <div className="restaurant-vicinity">{restaurant.vicinity}</div>
          </div>
          <button className="add-button" onClick={() => addRestaurant(restaurant)}>Add</button>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
