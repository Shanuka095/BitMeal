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
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');
        console.log('Fetching with token:', token.substring(0, 10) + '...');
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
        if (data.length === 0) console.log('No restaurants found');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load restaurants');
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
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(restaurants.filter(r => r._id !== id));
      } catch (err) {
        setError('Failed to delete restaurant');
      }
    }
  };

  const handleViewDetails = (id) => navigate(`/admin/restaurant/${id}`);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <aside className="fixed w-64 h-screen bg-gradient-to-br from-yellow-600 to-orange-500 text-white p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li><button onClick={() => navigate('/admin')} className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/admin' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}><FaUtensils className="inline mr-2" /> Overview</button></li>
            <li><button onClick={() => navigate('/admin/create-restaurant')} className={`w-full text-left p-3 rounded-lg transition ${location.pathname === '/admin/create-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}><FaUtensils className="inline mr-2" /> Add Restaurant</button></li>
            <li><button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-yellow-400 mt-6"><FaSignOutAlt className="inline mr-2" /> Logout</button></li>
          </ul>
        </nav>
      </aside>
      <main className="ml-64 p-8 pt-6">
        <header className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
        </header>
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">My Restaurants</h2>
          {loading ? (
            <div className="flex justify-center"><p className="text-gray-600">Loading...</p></div>
          ) : error ? (
            <div className="flex justify-center"><p className="text-red-600">{error}</p></div>
          ) : restaurants.length === 0 ? (
            <div className="flex justify-center"><p className="text-gray-600">No restaurants found. Create one to get started.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Address: {restaurant.address}</p>
                  <div className="mt-3 flex space-x-3">
                    <button onClick={() => handleViewDetails(restaurant._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <FaUtensils className="mr-1" /> Details
                    </button>
                    <button onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RestaurantAdmin;