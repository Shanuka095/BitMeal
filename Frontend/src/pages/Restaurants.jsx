import { useState, useEffect } from 'react';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/restaurants');
        setRestaurants(response.data.restaurants || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurants');
        console.error('Fetch restaurants error:', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#2A3335',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
    }}>
      <div style={{ maxWidth: '1200px', width: '100%', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem', color: '#F8FAFC' }}>Explore Restaurants</h2>
        {error && <p style={{ color: '#EF4444', textAlign: 'center' }}>{error}</p>}
        {restaurants.length === 0 && !error && <p style={{ color: '#F8FAFC', textAlign: 'center' }}>No restaurants found.</p>}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} style={{
              backgroundColor: 'rgba(248, 250, 252, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              border: 'none',
            }}>
              <h3 style={{ fontSize: '1.5rem', color: '#F8FAFC', marginBottom: '10px' }}>{restaurant.name}</h3>
              <p style={{ color: '#F8FAFC', marginBottom: '5px' }}>Address: {restaurant.address}</p>
              <p style={{ color: '#F8FAFC', marginBottom: '5px' }}>Cuisine: {restaurant.cuisine}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;