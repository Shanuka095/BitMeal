import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
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

  if (loading) return <div className="flex justify-center"><p className="text-gray-600">Loading...</p></div>;
  if (error) return <div className="flex justify-center"><p className="text-red-600 font-semibold">{error}</p></div>;
  if (!restaurant) return <div className="flex justify-center"><p className="text-gray-600">Restaurant not found.</p></div>;

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">{restaurant.name} Details</h2>
        <button
          onClick={handleAddMenuItem}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition"
        >
          <FaPlus className="mr-2" /> Add Menu Item
        </button>
      </div>
      <div className="space-y-4">
        <p><strong>Address:</strong> {restaurant.address}</p>
        <div>
          <strong>Menu:</strong>
          {restaurant.menu && restaurant.menu.length > 0 ? (
            <ul className="list-disc pl-5 mt-2">
              {restaurant.menu.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.name} - ${item.price} ({item.category})
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