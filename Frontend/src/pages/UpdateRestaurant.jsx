// src/pages/UpdateRestaurant.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UpdateRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [updateRestaurant, setUpdateRestaurant] = useState({ id: '', name: '', address: '', cuisine: '' });
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
      }
    };
    fetchRestaurants();
  }, []);

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
      setMessage('Restaurant updated');
      setError('');
      setTimeout(() => navigate('/admin'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update restaurant');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans text-[#4f4f4f] flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-[#4f4f4f] mb-8 text-center tracking-wide">Update Restaurant</h2>
          {error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}
          {message && <p className="text-[#ffaa00] text-center text-sm mb-4">{message}</p>}
          <div className="bg-white/95 rounded-2xl p-8 shadow-xl border border-[#ffaa00]/20">
            <form onSubmit={handleUpdateRestaurant} className="space-y-6">
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
                className="w-full px-5 py-3 bg-[#f5f5f5] text-[#4f4f4f] rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Restaurant Name"
                value={updateRestaurant.name}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, name: e.target.value })}
                className="w-full px-5 py-3 bg-[#f5f5f5] text-[#4f4f4f] rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-500 transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={updateRestaurant.address}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, address: e.target.value })}
                className="w-full px-5 py-3 bg-[#f5f5f5] text-[#4f4f4f] rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-500 transition-all duration-200"
                required
              />
              <input
                type="text"
                placeholder="Cuisine"
                value={updateRestaurant.cuisine}
                onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, cuisine: e.target.value })}
                className="w-full px-5 py-3 bg-[#f5f5f5] text-[#4f4f4f] rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-500 transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#ffaa00] hover:bg-[#cc8800] transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading ? 'Updating...' : 'Update Restaurant'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateRestaurant;