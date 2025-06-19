import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ name: response.data.name, address: response.data.address });
        console.log('Frontend (UpdateRestaurant): Fetched restaurant for update:', response.data.name);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant for update');
        console.error('Frontend (UpdateRestaurant) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.put(`http://localhost:3003/api/restaurants/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Frontend (UpdateRestaurant) - Restaurant updated successfully:', form.name);
      navigate('/admin'); // Navigate back to the admin dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update restaurant');
      console.error('Frontend (UpdateRestaurant) - Update error:', err.response ? err.response.data : err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"><p className="text-gray-600">Loading restaurant data...</p></section>;
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Update Restaurant</h2>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
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
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffaa00] text-white p-2 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Restaurant'}
        </button>
      </form>
    </section>
  );
};

export default UpdateRestaurant;