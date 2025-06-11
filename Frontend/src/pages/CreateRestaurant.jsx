import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3003/api/restaurants', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create restaurant');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Restaurant</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Restaurant Name"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;