// src/pages/RestaurantAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaSignOutAlt, FaTrash } from 'react-icons/fa';

const RestaurantAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data || []);
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteRestaurant = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove this "${name}" restaurant?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(restaurants.filter(r => r._id !== id));
      } catch (err) {
        setError('Failed to delete restaurant');
        console.error('Delete error:', err);
      }
    }
  };

  const handleViewDetails = (id) => navigate(`/admin/restaurant/${id}`);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-yellow-600 to-orange-500 text-white p-6 shadow-2xl fixed h-full">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-wide">Admin Panel</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/create-restaurant')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin/create-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Create Restaurant
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/update-restaurant')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin/update-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Update Restaurant
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-yellow-400 transition-all duration-300 mt-6"
              >
                <FaSignOutAlt className="mr-3 text-xl" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <header className="bg-white shadow-lg rounded-xl p-6 mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Restaurant Admin Dashboard</h1>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Admin</span>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700">
              A
            </div>
          </div>
        </header>

        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">Managed Restaurants</h2>
          {loading ? (
            <div className="flex justify-center"><p className="text-gray-600 text-lg">Loading...</p></div>
          ) : error ? (
            <div className="flex justify-center"><p className="text-red-600 text-lg">{error}</p></div>
          ) : restaurants.length === 0 ? (
            <div className="flex justify-center"><p className="text-gray-600 text-lg">No restaurants found.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-1">Address: {restaurant.address}</p>
                  <p className="text-gray-600 mb-1">Cuisine: {restaurant.cuisine}</p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Menu Items:</h4>
                    {restaurant.menu.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {restaurant.menu.map((item, index) => (
                          <li key={index}>{item.name} - ${item.price} ({item.category})</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No menu items</p>
                    )}
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleViewDetails(restaurant._id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FaUtensils className="mr-2 inline" /> View Details
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <FaTrash className="mr-2 inline" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdmin;