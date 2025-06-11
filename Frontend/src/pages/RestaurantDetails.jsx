import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/public/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch details');
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <div>
      <h1>Restaurant Details</h1>
      {error ? <p>{error}</p> : restaurant ? (
        <div>
          <p>Name: {restaurant.name}</p>
          <p>Address: {restaurant.address}</p>
          <h3>Menu:</h3>
          {restaurant.menu.map((item, index) => (
            <p key={index}>{item.name} - ${item.price}</p>
          ))}
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default RestaurantDetails;