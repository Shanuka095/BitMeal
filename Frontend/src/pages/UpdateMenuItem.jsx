import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateMenuItem = () => {
  const { id, menuId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', category: '', image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const categories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
    'Soups',
    'Salads',
    'Breakfast',
    'Snacks',
    'Other'
  ];

  useEffect(() => {
    const fetchMenuItem = async () => {
      setLoading(true);
      setError('');
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}/menu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: response.data.name,
          price: response.data.price,
          category: response.data.category,
          image: null
        });
        setPreview(response.data.imageUrl ? `http://localhost:3003/uploads/${response.data.imageUrl}` : null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch menu item for update');
        console.error('Frontend (UpdateMenuItem) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [id, menuId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setError('No authentication token found. Please log in.');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (form.image) {
        formData.append('image', form.image);
      } else if (preview && !preview.startsWith('blob:')) {
        const existingFilename = preview.split('/').pop();
        formData.append('imageUrl', existingFilename);
      }

      await axios.put(`http://localhost:3003/api/restaurants/${id}/menu/${menuId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Frontend (UpdateMenuItem) - Menu item updated successfully:', form.name);
      navigate(`/admin/restaurant/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update menu item');
      console.error('Frontend (UpdateMenuItem) - Update error:', err.response ? err.response.data : err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/admin/restaurant/${id}`);
  };

  if (loading) {
    return <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl"><p className="text-gray-600">Loading menu item data...</p></section>;
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl border border-gray-200">
      <div className="flex items-center mb-6 border-b-2 border-gray-200 pb-4">
        <button
          onClick={handleBack}
          className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center mr-4 transition duration-200 ease-in-out"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Update Menu Item</h2>
      </div>
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
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Menu Item'}
        </button>
      </form>
    </section>
  );
};

export default UpdateMenuItem;
