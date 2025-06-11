import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', category: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3003/api/restaurants/${id}/menu`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add menu item');
    }
  };

  return (
    <div>
      <h1>Add Menu Item</h1>
      <form onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" />
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" />
        <button type="submit">Add</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default AddMenuItem;