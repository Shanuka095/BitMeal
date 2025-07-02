import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', category: '', image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Predefined categories for the dropdown
  const categories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
    'Soups',
    'Salads',
    'Breakfast',
    'Snacks',
    'Other' // Added 'Other' for flexibility
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (form.image) formData.append('image', form.image);

      await axios.post(`http://localhost:3003/api/restaurants/${id}/menu`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Frontend (AddMenuItem) - Menu item added successfully for restaurant ID:', id);
      navigate(`/admin/restaurant/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add menu item');
      console.error('Frontend (AddMenuItem) - Error:', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Add Menu Item</h2>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter item name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Enter price"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Menu Item Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md shadow-sm" />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Menu Item'}
        </button>
      </form>
    </section>
  );
};

export default AddMenuItem;
