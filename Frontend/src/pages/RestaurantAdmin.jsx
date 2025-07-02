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
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : localStorage.getItem('token');

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
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
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
    <section className="bg-white rounded-xl shadow-2xl p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">My Restaurants</h2>
      </div>

      {loading ? (
        <div className="flex justify-center"><p className="text-gray-600 text-lg">Loading restaurants...</p></div>
      ) : error ? (
        <div className="flex justify-center"><p className="text-red-600 font-semibold text-lg">{error}</p></div>
      ) : restaurants.length === 0 ? (
        <div className="flex justify-center"><p className="text-gray-600 text-lg">No restaurants found. Create one to get started.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 border border-gray-100 group">
              {restaurant.imageUrl && (
                <img
                  src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{restaurant.name}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">Address: {restaurant.address}</p>
              <div className="mt-auto flex space-x-3 justify-end"> {/* Use mt-auto and justify-end for alignment */}
                <button
                  onClick={() => handleViewDetails(restaurant._id)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center text-sm transition shadow-md hover:shadow-lg font-semibold"
                >
                  <FaEye className="mr-2" /> View Details
                </button>
                <button
                  onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 flex items-center text-sm transition shadow-md hover:shadow-lg font-semibold"
                >
                  <FaTrash className="mr-2" /> Delete
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
