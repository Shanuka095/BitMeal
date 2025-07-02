import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    // Create a local URL for image preview
    setPreview(file ? URL.createObjectURL(file) : null);
    console.log('Selected file:', file); // Debug log for file selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', form.address);
      if (form.image) {
        formData.append('image', form.image);
        console.log('Appending image:', form.image.name); // Debug log for image upload
      }

      const response = await axios.post('http://localhost:3003/api/restaurants', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // No need to set 'Content-Type': 'multipart/form-data' manually,
          // Axios and FormData handle it automatically and correctly.
        },
      });

      console.log('Frontend (CreateRestaurant) - Restaurant created successfully:', response.data);
      setSuccess(`Restaurant created successfully: ${response.data.name}`);
      setForm({ name: '', address: '', image: null }); // Clear form
      setPreview(null); // Clear preview
      setTimeout(() => navigate('/admin'), 1000); // Delay navigation for user feedback
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create restaurant';
      setError(errorMsg);
      console.error('Frontend (CreateRestaurant) - Error:', {
        message: errorMsg,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Create New Restaurant</h2>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-semibold">{success}</p>}
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
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
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
