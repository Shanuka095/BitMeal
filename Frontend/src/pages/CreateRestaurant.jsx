import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.post('http://localhost:3003/api/restaurants', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Frontend (CreateRestaurant) - Restaurant created successfully:', form.name);
      navigate('/admin'); // Navigate back to the admin dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create restaurant');
      console.error('Frontend (CreateRestaurant) - Error:', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create New Restaurant</h2>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter restaurant name"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            id="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Enter address"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffaa00] text-white p-2 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Restaurant'}
        </button>
      </form>
    </section>
  );
};

export default CreateRestaurant;