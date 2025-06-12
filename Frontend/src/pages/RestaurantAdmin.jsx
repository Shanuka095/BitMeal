import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import jwtDecode from 'jwt-decode'; // Reverted to default import for jwt-decode

const RestaurantAdmin = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Frontend (RestaurantAdmin) - No authentication token found.');
          throw new Error('No authentication token');
        }

        console.log('Frontend (RestaurantAdmin) - Fetching with token (first 10 chars):', token.substring(0, 10) + '...');
        
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data || response.data;
        
        if (Array.isArray(data)) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          console.log('Frontend (RestaurantAdmin) - Decoded userId from token:', userId);
          const userRestaurants = data.filter(r => r.owner === userId);
          setRestaurants(userRestaurants);
          if (userRestaurants.length === 0) {
            console.log('Frontend (RestaurantAdmin) - No restaurants found for this admin after client-side filter.');
            setError('No restaurants found for this admin. Create one to get started.');
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
          console.log('Frontend (RestaurantAdmin): 403 Error - Access denied. The backend middleware blocked the request.');
        } else if (err.response?.status === 401) {
          console.log('Frontend (RestaurantAdmin): 401 Error - Unauthorized. Token might be invalid or missing, or expired.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDeleteRestaurant = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');
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

  const handleCreateRestaurant = () => navigate('/admin/create-restaurant');
  const handleViewDetails = (id) => navigate(`/admin/restaurant/${id}`);

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">My Restaurants</h2>
        <button
          onClick={handleCreateRestaurant}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition"
        >
          <FaPlus className="mr-2" /> Add New Restaurant
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center"><p className="text-gray-600">Loading restaurants...</p></div>
      ) : error ? (
        <div className="flex justify-center"><p className="text-red-600 font-semibold">{error}</p></div>
      ) : restaurants.length === 0 ? (
        <div className="flex justify-center"><p className="text-gray-600">No restaurants found. Click "Add New Restaurant" to get started.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
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