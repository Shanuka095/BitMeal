// src/pages/AdminRestaurantDetails.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaSignOutAlt, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import AddMenuItem from './AddMenuItem';

const AdminRestaurantDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Updating menu item:', { restaurantId: id, menuId: editMenuItem._id, data: editMenuItem });
      const response = await axios.put(`http://localhost:3003/api/restaurants/${id}/menu/${editMenuItem._id}`, editMenuItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurant({
        ...restaurant,
        menu: restaurant.menu.map(item => item._id === editMenuItem._id ? editMenuItem : item)
      });
      setEditMenuItem(null);
      setShowUpdateForm(false);
    } catch (err) {
      setError('Failed to update menu item');
      console.error('Update error:', err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteMenuItem = async (menuId) => {
    if (window.confirm(`Are you sure you want to remove this menu item?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3003/api/restaurants/${id}/menu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant({
          ...restaurant,
          menu: restaurant.menu.filter(item => item._id !== menuId)
        });
      } catch (err) {
        setError('Failed to delete menu item');
        console.error('Delete error:', err);
      }
    }
  };

  const handleUpdateClick = (item) => {
    setEditMenuItem({ ...item });
    setShowUpdateForm(true);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-gray-600 text-lg">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-600 text-lg">{error}</p></div>;
  if (!restaurant) return <div className="flex justify-center items-center h-screen"><p className="text-gray-600 text-lg">Restaurant not found</p></div>;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-yellow-600 to-orange-500 text-white p-6 shadow-2xl fixed h-full">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-wide">Admin Panel</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/create-restaurant')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin/create-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Create Restaurant
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/update-restaurant')}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${location.pathname === '/admin/update-restaurant' ? 'bg-yellow-500 font-semibold' : 'hover:bg-yellow-400'}`}
              >
                <FaUtensils className="mr-3 text-xl" /> Update Restaurant
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-yellow-400 transition-all duration-300 mt-6"
              >
                <FaSignOutAlt className="mr-3 text-xl" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <header className="bg-white shadow-lg rounded-xl p-6 mb-8 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-gray-900 flex items-center font-medium transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2 text-lg" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900">{restaurant.name} Details</h1>
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-medium">Admin</span>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700">
              A
            </div>
          </div>
        </header>

        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">Restaurant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="text-lg text-gray-700"><strong>Address:</strong> {restaurant.address}</p>
            <p className="text-lg text-gray-700"><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6 border-b-2 border-gray-200 pb-4">Menu Items</h2>
          {restaurant.menu.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-lg font-semibold text-gray-700">Name</th>
                    <th className="p-4 text-lg font-semibold text-gray-700">Price</th>
                    <th className="p-4 text-lg font-semibold text-gray-700">Category</th>
                    <th className="p-4 text-lg font-semibold text-gray-700">Description</th>
                    <th className="p-4 text-lg font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurant.menu.map((item) => (
                    <tr key={item._id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-4 text-gray-800">{item.name}</td>
                      <td className="p-4 text-gray-800">${item.price}</td>
                      <td className="p-4 text-gray-800">{item.category}</td>
                      <td className="p-4 text-gray-600">{item.description || 'N/A'}</td>
                      <td className="p-4 flex space-x-3">
                        <button
                          onClick={() => handleUpdateClick(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <FaEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-lg">No menu items available.</p>
          )}

          <h3 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Add New Menu Item</h3>
          <AddMenuItem restaurantId={id} onAddSuccess={() => setRestaurant({ ...restaurant })} />
        </div>

        {showUpdateForm && editMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 border-t-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">Update Menu Item</h3>
              <form onSubmit={handleUpdateMenuItem} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editMenuItem.name}
                    onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={editMenuItem.description}
                    onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editMenuItem.price}
                    onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editMenuItem.category}
                    onChange={(e) => setEditMenuItem({ ...editMenuItem, category: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => { setEditMenuItem(null); setShowUpdateForm(false); }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantDetails;