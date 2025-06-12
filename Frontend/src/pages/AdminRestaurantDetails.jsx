import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }
        const response = await axios.get(`http://localhost:3003/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data);
        console.log('Frontend (AdminRestaurantDetails): Fetched restaurant details for ID:', id);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch restaurant details';
        setError(errorMessage);
        console.error('Frontend (AdminRestaurantDetails) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <section className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Restaurant Details</h2>
      {loading ? (
        <p className="text-gray-600">Loading restaurant details...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : restaurant ? (
        <div>
          <p className="mb-2"><strong>Name:</strong> {restaurant.name}</p>
          <p className="mb-4"><strong>Address:</strong> {restaurant.address}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Menu:</h3>
          {restaurant.menu && restaurant.menu.length > 0 ? (
            <ul className="list-disc pl-5 mt-2">
              {restaurant.menu.map((item, index) => (
                <li key={item._id || index} className="py-1">
                  <strong>{item.name}</strong> - ${item.price} ({item.category})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No menu items available for this restaurant.</p>
          )}
          {/* Add buttons for managing menu items or updating restaurant here */}
          <div className="mt-6 flex space-x-3">
             <button
               onClick={() => alert('Navigate to Add Menu Item')} // Replace with actual navigation
               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
             >
               Add Menu Item
             </button>
             <button
               onClick={() => alert('Navigate to Update Restaurant')} // Replace with actual navigation
               className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
             >
               Edit Restaurant
             </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Restaurant not found.</p>
      )}
    </section>
  );
};

export default AdminRestaurantDetails;