import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';

const AdminRestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      setError('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : localStorage.getItem('token');

      if (!token) {
        console.error('Frontend (AdminRestaurantDetails) - No authentication token found.');
        setError('No authentication token');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Frontend (AdminRestaurantDetails) - API Response:', response.data);
        setRestaurant(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load restaurant details';
        setError(errorMessage);
        console.error('Frontend (AdminRestaurantDetails) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  const handleAddMenuItem = () => {
    navigate(`/admin/restaurant/${id}/add-menu-item`);
  };

  const handleEditRestaurant = () => {
    navigate(`/admin/update-restaurant/${id}`);
  };

  const handleUpdateMenuItem = (menuItem) => {
    // Navigate to a new route or open a modal for updating (for simplicity, using a new route)
    navigate(`/admin/restaurant/${id}/menu/${menuItem._id}/edit`);
  };

  const handleDeleteMenuItem = async (menuItemId, menuItemName) => {
    if (window.confirm(`Are you sure you want to delete "${menuItemName}"? This action cannot be undone.`)) {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:3003/api/restaurants/${id}/menu/${menuItemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(prev => ({
          ...prev,
          menu: prev.menu.filter(item => item._id !== menuItemId),
        }));
        console.log(`Frontend (AdminRestaurantDetails) - Menu item ${menuItemName} deleted successfully.`);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete menu item');
        console.error('Frontend (AdminRestaurantDetails) - Delete error:', err.response ? err.response.data : err);
      }
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-gray-600 text-lg">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-600 text-lg font-semibold">{error}</p></div>;
  if (!restaurant) return <div className="flex justify-center items-center h-screen"><p className="text-gray-600 text-lg">Restaurant not found.</p></div>;

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mx-auto max-w-4xl mt-6">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center transition duration-200 ease-in-out"
          >
            <FaArrowLeft className="mr-1" /> Back
          </button>
          <h2 className="text-3xl font-bold text-gray-800">{restaurant.name} Details</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddMenuItem}
            className="bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#45a049] flex items-center transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" /> Add Menu Item
          </button>
          <button
            onClick={handleEditRestaurant}
            className="bg-[#ffaa00] text-white px-6 py-2 rounded-lg hover:bg-[#e59400] flex items-center transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            <FaEdit className="mr-2" /> Edit Restaurant
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700"><strong className="text-gray-900">Address:</strong> {restaurant.address}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <strong className="text-gray-900 text-lg">Menu:</strong>
          {restaurant.menu && restaurant.menu.length > 0 ? (
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {restaurant.menu.map((item) => (
                <li key={item._id} className="text-gray-700 flex justify-between items-center">
                  <span>
                    {item.name} - <span className="font-semibold">${item.price}</span> ({item.category})
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUpdateMenuItem(item)}
                      className="bg-[#ffaa00] text-white px-3 py-1 rounded-lg hover:bg-[#e59400] transition duration-200 ease-in-out text-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id, item.name)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-2">No menu items available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminRestaurantDetails;