// src/pages/UpdateRestaurant.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaSignOutAlt } from 'react-icons/fa';

const UpdateRestaurant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [updateRestaurant, setUpdateRestaurant] = useState({ id: '', name: '', address: '', cuisine: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data || []);
        const id = searchParams.get('id');
        if (id) {
          const selected = response.data.find(r => r._id === id);
          if (selected) {
            setUpdateRestaurant({
              id: selected._id,
              name: selected.name,
              address: selected.address,
              cuisine: selected.cuisine,
            });
          }
        }
      } catch (err) {
        console.error('Fetch restaurants error:', err);
        setError('Failed to load restaurants');
      }
    };
    fetchRestaurants();
  }, [searchParams]);

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.put(`http://localhost:3003/api/restaurants/${updateRestaurant.id}`, {
        name: updateRestaurant.name,
        address: updateRestaurant.address,
        cuisine: updateRestaurant.cuisine,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Restaurant updated successfully');
      setError('');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update restaurant');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
          <h1 className="text-4xl font-extrabold text-gray-900">Update Restaurant</h1>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Admin</span>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700">
              A
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          {error && <p className="text-red-600 text-center text-lg mb-4">{error}</p>}
          {message && <p className="text-yellow-600 text-center text-lg mb-4">{message}</p>}
          <div className="bg-white rounded-xl p-8 shadow-xl border border-yellow-200">
            <form onSubmit={handleUpdateRestaurant} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Restaurant</label>
                <select
                  value={updateRestaurant.id}
                  onChange={(e) => {
                    const selected = restaurants.find(r => r._id === e.target.value);
                    if (selected) {
                      setUpdateRestaurant({
                        id: selected._id,
                        name: selected.name,
                        address: selected.address,
                        cuisine: selected.cuisine,
                      });
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={updateRestaurant.name}
                  onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  value={updateRestaurant.address}
                  onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                <input
                  type="text"
                  placeholder="Cuisine"
                  value={updateRestaurant.cuisine}
                  onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, cuisine: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-yellow-600 hover:bg-yellow-700 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
              >
                {loading ? 'Updating...' : 'Update Restaurant'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRestaurant;