import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Restaurants = ({ standalone }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3003/api/restaurants/public');
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <div className="p-6 text-center"><p className="text-gray-600">Loading...</p></div>;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{standalone ? 'Restaurants' : 'Explore Restaurants'}</h2>
      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-200"
            >
              {restaurant.imageUrl && (
                <img
                  src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
              <p className="text-sm text-gray-500">Menu Items: {restaurant.menu ? restaurant.menu.length : 0}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No restaurants available</p>
      )}
    </div>
  );
};

export default Restaurants;