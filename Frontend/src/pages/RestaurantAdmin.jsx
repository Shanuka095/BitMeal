import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        const response = await axios.get('http://localhost:3000/api/restaurants', {
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
      const response = await axios.post('http://localhost:3000/api/restaurants', restaurant, {
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
      await axios.post(`http://localhost:3000/api/restaurants/${menuItem.restaurantId}/menu`, menuItem, {
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
      await axios.put(`http://localhost:3000/api/restaurants/${updateRestaurant.id}`, {
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
      await axios.delete(`http://localhost:3000/api/restaurants/${deleteRestaurantId}`, {
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
    <div className="w-screen min-h-screen bg-[#2A3335] flex flex-col items-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-4xl font-bold text-[#F8FAFC] text-center mb-8">Restaurant Admin Panel</h2>
        {error && <p className="text-[#EF4444] text-center text-sm">{error}</p>}
        {message && <p className="text-[#EFB036] text-center text-sm">{message}</p>}

        {/* Create Restaurant */}
        <div className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-6 border border-[rgba(248,250,252,0.1)]">
          <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Create Restaurant</h3>
          <form onSubmit={handleCreateRestaurant} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={restaurant.name}
              onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={restaurant.address}
              onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              required
            />
            <input
              type="text"
              placeholder="Cuisine"
              value={restaurant.cuisine}
              onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              required
            />
            <button
              type="submit"
              disabled={loading.create}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-[#2A3335] bg-[#EFB036] hover:bg-[#D97706] transition-colors ${loading.create ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading.create ? 'Creating...' : 'Create Restaurant'}
            </button>
          </form>
        </div>

        {/* Update Restaurant */}
        <div className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-6 border border-[rgba(248,250,252,0.1)]">
          <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Update Restaurant</h3>
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
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
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
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={updateRestaurant.address}
              onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, address: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <input
              type="text"
              placeholder="Cuisine"
              value={updateRestaurant.cuisine}
              onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, cuisine: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <button
              type="submit"
              disabled={loading.update}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${loading.update ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading.update ? 'Updating...' : 'Update Restaurant'}
            </button>
          </form>
        </div>

        {/* Delete Restaurant */}
        <div className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-6 border border-[rgba(248,250,252,0.1)]">
          <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Delete Restaurant</h3>
          <form onSubmit={handleDeleteRestaurant} className="space-y-4">
            <select
              value={deleteRestaurantId}
              onChange={(e) => setDeleteRestaurantId(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
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
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors ${loading.delete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading.delete ? 'Deleting...' : 'Delete Restaurant'}
            </button>
          </form>
        </div>

        {/* Add Menu Item */}
        <div className="bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl p-6 border border-[rgba(248,250,252,0.1)]">
          <h3 className="text-2xl font-semibold text-[#F8FAFC] mb-4">Add Menu Item</h3>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <select
              value={menuItem.restaurantId}
              onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
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
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={menuItem.description}
              onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
            />
            <input
              type="number"
              placeholder="Price"
              value={menuItem.price}
              onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={menuItem.category}
              onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036]"
              required
            />
            <button
              type="submit"
              disabled={loading.menu}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-[#2A3335] bg-[#EFB036] hover:bg-[#D97706] transition-colors ${loading.menu ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading.menu ? 'Adding...' : 'Add Menu Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdmin;