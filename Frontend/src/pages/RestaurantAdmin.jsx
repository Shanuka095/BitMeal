import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantAdmin = () => {
  const [restaurant, setRestaurant] = useState({ name: '', address: '', cuisine: '' });
  const [menuItem, setMenuItem] = useState({ restaurantId: '', name: '', description: '', price: '', category: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      const response = await axios.post('http://localhost:3000/api/restaurants', restaurant, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Restaurant created: ${response.data.restaurant._id}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create restaurant');
      setMessage('');
      console.error('Create restaurant error:', err);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.post(`http://localhost:3000/api/restaurants/${menuItem.restaurantId}/menu`, menuItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Menu item added');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add menu item');
      setMessage('');
      console.error('Add menu item error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2A3335', padding: '20px', color: '#F8FAFC' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Restaurant Admin</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Create Restaurant</h3>
        <form onSubmit={handleCreateRestaurant}>
          <input
            type="text"
            placeholder="Name"
            value={restaurant.name}
            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={restaurant.address}
            onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={restaurant.cuisine}
            onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          {message && <p style={{ color: '#EFB036' }}>{message}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#EFB036', color: '#2A3335', borderRadius: '8px' }}>
            Create Restaurant
          </button>
        </form>
        <h3 style={{ marginTop: '30px' }}>Add Menu Item</h3>
        <form onSubmit={handleAddMenuItem}>
          <input
            type="text"
            placeholder="Restaurant ID"
            value={menuItem.restaurantId}
            onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="text"
            placeholder="Item Name"
            value={menuItem.name}
            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={menuItem.description}
            onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuItem.price}
            onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={menuItem.category}
            onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          {message && <p style={{ color: '#EFB036' }}>{message}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#EFB036', color: '#2A3335', borderRadius: '8px' }}>
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantAdmin;