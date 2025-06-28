import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

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
        setForm({ name: response.data.name, address: response.data.address, image: null });
        setPreview(response.data.imageUrl || null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant for update');
        console.error('Frontend (UpdateRestaurant) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : form.imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', form.address);
      if (form.image) formData.append('image', form.image);

      await axios.put(`http://localhost:3003/api/restaurants/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Frontend (UpdateRestaurant) - Restaurant updated successfully:', form.name);
      navigate(`/admin/restaurant/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update restaurant');
      console.error('Frontend (UpdateRestaurant) - Update error:', err.response ? err.response.data : err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/admin/restaurant/${id}`);
  };

  if (loading) {
    return <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"><p className="text-gray-600">Loading restaurant data...</p></section>;
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 border-b-2 border-gray-200 pb-4">
        <button
          onClick={handleBack}
          className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center mr-4 transition duration-200 ease-in-out"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Update Restaurant</h2>
      </div>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
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
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Restaurant'}
        </button>
      </form>
    </section>
  );
};

export default UpdateRestaurant;