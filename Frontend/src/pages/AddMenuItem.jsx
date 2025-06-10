// src/pages/AddMenuItem.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaSignOutAlt } from 'react-icons/fa';

const AddMenuItem = ({ restaurantId, onAddSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItem, setMenuItem] = useState({ restaurantId: restaurantId || '', name: '', description: '', price: '', category: '' });
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
        const id = searchParams.get('id') || restaurantId;
        if (id && !menuItem.restaurantId) {
          setMenuItem(prev => ({ ...prev, restaurantId: id }));
        }
      } catch (err) {
        console.error('Fetch restaurants error:', err);
        setError('Failed to load restaurants');
      }
    };
    fetchRestaurants();
  }, [searchParams, restaurantId]);

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
        price: parseFloat(menuItem.price) || 0,
        category: menuItem.category,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Menu item added successfully');
      setError('');
      setMenuItem({ restaurantId: menuItem.restaurantId, name: '', description: '', price: '', category: '' });
      if (onAddSuccess) onAddSuccess();
    } catch (err) {
      console.error('Add menu item error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Failed to add menu item');
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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}
      {message && <p className="text-[#ffaa00] text-center text-sm mb-4">{message}</p>}
      <form onSubmit={handleAddMenuItem} className="space-y-6">
        <select
          value={menuItem.restaurantId}
          onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
          className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
          required
          disabled={restaurantId} // Disable if restaurantId is passed as prop
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
  );
};

export default AddMenuItem;