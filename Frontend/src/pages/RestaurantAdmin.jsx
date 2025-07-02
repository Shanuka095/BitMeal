import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEye } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';

const RestaurantAdmin = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError('');
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      if (!token) {
        console.error('Frontend (RestaurantAdmin) - No authentication token found.');
        setError('No authentication token');
        setLoading(false);
        return;
      }

      console.log('Frontend (RestaurantAdmin) - Fetching with token (first 10 chars):', token.substring(0, 10) + '...');
      try {
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Frontend (RestaurantAdmin) - API Response:', response.data);
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setRestaurants(data);
          if (data.length === 0) {
            console.log('Frontend (RestaurantAdmin) - No restaurants found.');
            setError('No restaurants found. Create one to get started.');
          }
        } else {
          console.warn('Frontend (RestaurantAdmin) - Expected an array of restaurants, got:', data);
          setRestaurants([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load restaurants';
        setError(errorMessage);
        console.error('Frontend (RestaurantAdmin) - Fetch error:', err.response ? err.response.data : err);
        if (err.response?.status === 403) {
          console.log('Frontend (RestaurantAdmin): 403 Error - Access denied.');
        } else if (err.response?.status === 401) {
          console.log('Frontend (RestaurantAdmin): 401 Error - Unauthorized.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDeleteRestaurant = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      try {
        await axios.delete(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(restaurants.filter(r => r._id !== id));
        console.log(`Frontend (RestaurantAdmin) - Restaurant ${name} deleted successfully.`);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete restaurant');
        console.error('Frontend (RestaurantAdmin) - Delete error:', err.response ? err.response.data : err);
      }
    }
  };

  const handleViewDetails = (id) => navigate(`/admin/restaurant/${id}`);

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">My Restaurants</h2>
      </div>

      {loading ? (
        <div className="flex justify-center"><p className="text-gray-600">Loading restaurants...</p></div>
      ) : error ? (
        <div className="flex justify-center"><p className="text-red-600 font-semibold">{error}</p></div>
      ) : restaurants.length === 0 ? (
        <div className="flex justify-center"><p className="text-gray-600">No restaurants found. Create one to get started.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
              {restaurant.imageUrl && (
                <img
                  src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Address: {restaurant.address}</p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleViewDetails(restaurant._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm transition"
                >
                  <FaEye className="mr-1" /> View Details
                </button>
                <button
                  onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center text-sm transition"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RestaurantAdmin;
