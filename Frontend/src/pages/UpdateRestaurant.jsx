import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ name: response.data.name, address: response.data.address });
      } catch (err) {
        setError('Failed to fetch restaurant');
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3003/api/restaurants/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update restaurant');
    }
  };

  return (
    <div>
      <h1>Update Restaurant</h1>
      <form onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
        <button type="submit">Update</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default UpdateRestaurant;