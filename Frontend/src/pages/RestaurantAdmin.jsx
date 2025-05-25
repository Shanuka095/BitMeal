import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantAdmin = () => {
  const [restaurant, setRestaurant] = useState({ name: '', address: '', cuisine: '' });
  const [menuItem, setMenuItem] = useState({ restaurantId: '', name: '', description: '', price: '', category: '' });
  const [updateRestaurant, setUpdateRestaurant] = useState({ id: '', name: '', address: '', cuisine: '' });
  const [deleteRestaurantId, setDeleteRestaurantId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState({ create: false, update: false, delete: false, menu: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data.restaurants || []);
      } catch (err) {
        console.error('Fetch restaurants error:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, create: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      const response = await axios.post('http://localhost:3000/api/restaurants', restaurant, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Restaurant created: ${response.data.restaurant._id}`);
      setError('');
      setRestaurants([...restaurants, response.data.restaurant]);
      setRestaurant({ name: '', address: '', cuisine: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create restaurant');
      setMessage('');
      console.error('Create restaurant error:', err);
    } finally {
      setLoading({ ...loading, create: false });
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, menu: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.post(`http://localhost:3000/api/restaurants/${menuItem.restaurantId}/menu`, menuItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Menu item added');
      setError('');
      setMenuItem({ restaurantId: '', name: '', description: '', price: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add menu item');
      setMessage('');
      console.error('Add menu item error:', err);
    } finally {
      setLoading({ ...loading, menu: false });
    }
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, update: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.put(`http://localhost:3000/api/restaurants/${updateRestaurant.id}`, {
        name: updateRestaurant.name,
        address: updateRestaurant.address,
        cuisine: updateRestaurant.cuisine,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Restaurant updated');
      setError('');
      setRestaurants(restaurants.map(r => r._id === updateRestaurant.id ? { ...r, ...updateRestaurant } : r));
      setUpdateRestaurant({ id: '', name: '', address: '', cuisine: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update restaurant');
      setMessage('');
      console.error('Update restaurant error:', err);
    } finally {
      setLoading({ ...loading, update: false });
    }
  };

  const handleDeleteRestaurant = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, delete: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in again.');
      await axios.delete(`http://localhost:3000/api/restaurants/${deleteRestaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Restaurant deleted');
      setError('');
      setRestaurants(restaurants.filter(r => r._id !== deleteRestaurantId));
      setDeleteRestaurantId('');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete restaurant');
      setMessage('');
      console.error('Delete restaurant error:', err);
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#2A3335',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
    }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', color: '#F8FAFC' }}>Restaurant Admin</h2>
        {error && <p style={{ color: '#EF4444', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: '#EFB036', textAlign: 'center' }}>{message}</p>}

        {/* Create Restaurant */}
        <h3 style={{ color: '#F8FAFC', marginBottom: '10px' }}>Create Restaurant</h3>
        <form onSubmit={handleCreateRestaurant}>
          <input
            type="text"
            placeholder="Name"
            value={restaurant.name}
            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={restaurant.address}
            onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={restaurant.cuisine}
            onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <button
            type="submit"
            disabled={loading.create}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading.create ? '#6B7280' : '#EFB036',
              color: loading.create ? '#F8FAFC' : '#2A3335',
              borderRadius: '8px',
              border: 'none',
              cursor: loading.create ? 'not-allowed' : 'pointer',
            }}
          >
            {loading.create ? 'Creating...' : 'Create Restaurant'}
          </button>
        </form>

        {/* Update Restaurant */}
        <h3 style={{ marginTop: '30px', color: '#F8FAFC', marginBottom: '10px' }}>Update Restaurant</h3>
        <form onSubmit={handleUpdateRestaurant}>
          <select
            value={updateRestaurant.id}
            onChange={(e) => {
              const selected = restaurants.find(r => r._id === e.target.value);
              setUpdateRestaurant({
                id: e.target.value,
                name: selected?.name || '',
                address: selected?.address || '',
                cuisine: selected?.cuisine || '',
              });
            }}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Name"
            value={updateRestaurant.name}
            onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={updateRestaurant.address}
            onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, address: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={updateRestaurant.cuisine}
            onChange={(e) => setUpdateRestaurant({ ...updateRestaurant, cuisine: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <button
            type="submit"
            disabled={loading.update}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading.update ? '#6B7280' : '#EFB036',
              color: loading.update ? '#F8FAFC' : '#2A3335',
              borderRadius: '8px',
              border: 'none',
              cursor: loading.update ? 'not-allowed' : 'pointer',
            }}
          >
            {loading.update ? 'Updating...' : 'Update Restaurant'}
          </button>
        </form>

        {/* Delete Restaurant */}
        <h3 style={{ marginTop: '30px', color: '#F8FAFC', marginBottom: '10px' }}>Delete Restaurant</h3>
        <form onSubmit={handleDeleteRestaurant}>
          <select
            value={deleteRestaurantId}
            onChange={(e) => setDeleteRestaurantId(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          >
            <option value="">Select Restaurant</option>
            {restaurants.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading.delete}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading.delete ? '#6B7280' : '#EF4444',
              color: '#F8FAFC',
              borderRadius: '8px',
              border: 'none',
              cursor: loading.delete ? 'not-allowed' : 'pointer',
            }}
          >
            {loading.delete ? 'Deleting...' : 'Delete Restaurant'}
          </button>
        </form>

        {/* Add Menu Item */}
        <h3 style={{ marginTop: '30px', color: '#F8FAFC', marginBottom: '10px' }}>Add Menu Item</h3>
        <form onSubmit={handleAddMenuItem}>
          <input
            type="text"
            placeholder="Restaurant ID"
            value={menuItem.restaurantId}
            onChange={(e) => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Item Name"
            value={menuItem.name}
            onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={menuItem.description}
            onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuItem.price}
            onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={menuItem.category}
            onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC', border: 'none' }}
            required
          />
          <button
            type="submit"
            disabled={loading.menu}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading.menu ? '#6B7280' : '#EFB036',
              color: loading.menu ? '#F8FAFC' : '#2A3335',
              borderRadius: '8px',
              border: 'none',
              cursor: loading.menu ? 'not-allowed' : 'pointer',
            }}
          >
            {loading.menu ? 'Adding...' : 'Add Menu Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantAdmin;