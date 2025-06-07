// src/pages/RestaurantAdmin.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RestaurantAdmin = () => {
  const [restaurant, setRestaurant] = useState({ name: '', address: '', cuisine: '' });
  const [menuItem, setMenuItem] = useState({ restaurantId: '', name: '', description: '', price: '', category: '' });
  const [updateRestaurant, setUpdateRestaurant] = useState({ id: '', name: '', address: '', cuisine: '' });
  const [deleteRestaurantId, setDeleteRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState({ create: false, update: false, delete: false, menu: false });
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
      }
    };
    fetchRestaurants();
  }, []);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, create: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      const response = await axios.post('http://localhost:3003/api/restaurants', restaurant, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Restaurant created: ${response.data.restaurant._id}`);
      setError('');
      setRestaurants([...restaurants, response.data.restaurant]);
      setRestaurant({ name: '', address: '', cuisine: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create restaurant');
      setMessage('');
      console.error('Create restaurant error:', err);
    } finally {
      setLoading({ ...loading, create: false });
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, menu: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.post('http://localhost:3003/api/restaurants/menu', menuItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Menu item added');
      setError('');
      setMenuItem({ restaurantId: '', name: '', description: '', price: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add menu item');
      setMessage('');
      console.error('Add menu item error:', err);
    } finally {
      setLoading({ ...loading, menu: false });
    }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, update: true });
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
      setMessage('Restaurant updated');
      setError('');
      setRestaurants(restaurants.map(r => r._id === updateRestaurant.id ? { ...r, ...updateRestaurant } : r));
      setUpdateRestaurant({ id: '', name: '', address: '', cuisine: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update restaurant');
      setMessage('');
      console.error('Update restaurant error:', err);
    } finally {
      setLoading({ ...loading, update: false });
    }
  };

  const handleDeleteRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, delete: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.delete(`http://localhost:3003/api/restaurants/${deleteRestaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Restaurant deleted');
      setError('');
      setRestaurants(restaurants.filter(r => r._id !== deleteRestaurantId));
      setDeleteRestaurantId('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete restaurant');
      setMessage('');
      console.error('Delete restaurant error:', err);
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-extrabold text-[#1F2937] text-center mb-8 tracking-tight">Restaurant Admin Panel</h2>
          {error && <p className="text-[#EF4444] text-center text-sm mb-4">{error}</p>}
          {message && <p className="text-[#e4b401] text-center text-sm mb-4">{message}</p>}

          {/* Create Restaurant */}
          <div className="bg-white/95 rounded-2xl p-6 mb-8 shadow-xl border border-[#e4b401]/20">
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-4">Create Restaurant</h3>
            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={restaurant.name}
                onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={restaurant.address}
                onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Cuisine"
                value={restaurant.cuisine}
                onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading.create}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading.create ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading.create ? 'Creating...' : 'Create Restaurant'}
              </button>
            </form>
          </div>

          {/* Update Restaurant */}
          <div className="bg-white/95 rounded-2xl p-6 mb-8 shadow-xl border border-[#e4b401]/20">
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-4">Update Restaurant</h3>
            <form onSubmit={handleUpdateRestaurant} className="space-y-4">
              <select
                value={updateRestaurant.id}
                onChange={(e) => {
                  const selected = restaurants.find(r => r._id === e.target.value);
                  setUpdateRestaurant({
                    id: e.target.value,
                    name: selected?.name || '',
                    address: selected?.address || '',
                    cuisine: selected?.cuisine || '',
                  });
                }}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Name"
                value={updateRestaurant.name}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={updateRestaurant.address}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, address: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Cuisine"
                value={updateRestaurant.cuisine}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, cuisine: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading.update}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading.update ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading.update ? 'Updating...' : 'Update Restaurant'}
              </button>
            </form>
          </div>

          {/* Delete Restaurant */}
          <div className="bg-white/95 rounded-2xl p-6 mb-8 shadow-xl border border-[#e4b401]/20">
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-4">Delete Restaurant</h3>
            <form onSubmit={handleDeleteRestaurant} className="space-y-4">
              <select
                value={deleteRestaurantId}
                onChange={(e) => setDeleteRestaurantId(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading.delete}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#EF4444] hover:bg-[#DC2626] transition-all duration-200 ${loading.delete ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading.delete ? 'Deleting...' : 'Delete Restaurant'}
              </button>
            </form>
          </div>

          {/* Add Menu Item */}
          <div className="bg-white/95 rounded-2xl p-6 mb-8 shadow-xl border border-[#e4b401]/20">
            <h3 className="text-2xl font-semibold text-[#1F2937] mb-4">Add Menu Item</h3>
            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <select
                value={menuItem.restaurantId}
                onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={menuItem.description}
                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
              />
              <input
                type="number"
                placeholder="Price"
                value={menuItem.price}
                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={menuItem.category}
                onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading.menu}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading.menu ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading.menu ? 'Adding...' : 'Add Menu Item'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantAdmin;