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
    <section className="bg-white rounded-xl shadow-2xl p-8 mx-auto max-w-5xl mt-8">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Restaurants
          </button>
          <h2 className="text-3xl font-bold text-gray-800">{restaurant.name} Details</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddMenuItem}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center transition duration-200 ease-in-out shadow-md hover:shadow-lg font-semibold"
          >
            <FaPlus className="mr-2" /> Add Menu Item
          </button>
          <button
            onClick={handleEditRestaurant}
            className="bg-[#ffaa00] text-white px-6 py-2 rounded-lg hover:bg-[#e59400] flex items-center transition duration-200 ease-in-out shadow-md hover:shadow-lg font-semibold"
          >
            <FaEdit className="mr-2" /> Edit Restaurant
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {restaurant.imageUrl && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
            <p className="text-gray-700 mb-2"><strong className="text-gray-900">Restaurant Image:</strong></p>
            <img
              src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
              alt={restaurant.name}
              className="mt-2 w-full max-w-sm h-64 object-cover rounded-md shadow-md"
            />
          </div>
        )}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
          <p className="text-gray-700"><strong className="text-gray-900">Address:</strong> {restaurant.address}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
          <strong className="text-gray-900 text-xl block mb-4">Menu Items:</strong>
          {restaurant.menu && restaurant.menu.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu.map((item) => (
                <li key={item._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition flex flex-col justify-between border border-gray-100">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
                    {/* Changed price display to Sri Lankan Rupees */}
                    <p className="text-gray-700 font-bold mb-1">Rs. {item.price}</p>
                    <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                    {item.imageUrl && (
                      <img
                        src={`http://localhost:3003/uploads/${item.imageUrl}`}
                        alt={item.name}
                        className="mt-2 w-full h-32 object-cover rounded-md shadow-sm"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex space-x-2 justify-end">
                    <button
                      onClick={() => handleUpdateMenuItem(item)}
                      className="bg-[#ffaa00] text-white px-4 py-2 rounded-lg hover:bg-[#e59400] transition duration-200 ease-in-out text-sm flex items-center shadow-sm hover:shadow-md"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id, item.name)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out text-sm flex items-center shadow-sm hover:shadow-md"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-2">No menu items available for this restaurant.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminRestaurantDetails;
