// src/pages/AddMenuItem.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMenuItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItem, setMenuItem] = useState({ restaurantId: '', name: '', description: '', price: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data || []);
      } catch (err) {
        console.error('Fetch restaurants error:', err);
        setError('Failed to load restaurants');
      }
    };
    fetchRestaurants();
  }, []);

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      if (!menuItem.restaurantId) throw new Error('Please select a restaurant.');
      await axios.post(`http://localhost:3003/api/restaurants/${menuItem.restaurantId}/menu`, {
        name: menuItem.name,
        description: menuItem.description,
        price: parseFloat(menuItem.price),
        category: menuItem.category,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Menu item added successfully');
      setError('');
      setMenuItem({ restaurantId: '', name: '', description: '', price: '', category: '' });
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      console.error('Add menu item error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Failed to add menu item');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col text-gray-800 font-sans">
      <div className="flex-grow pt-20">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center tracking-wide">Add Menu Item</h2>
          {error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}
          {message && <p className="text-[#ffaa00] text-center text-sm mb-4">{message}</p>}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-[#ffaa00]/20">
            <form onSubmit={handleAddMenuItem} className="space-y-6">
              <select
                value={menuItem.restaurantId}
                onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Item Name"
                value={menuItem.name}
                onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={menuItem.description}
                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={menuItem.price}
                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={menuItem.category}
                onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#ffaa00] hover:bg-[#e59400] transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
              >
                {loading ? 'Adding...' : 'Add Menu Item'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;