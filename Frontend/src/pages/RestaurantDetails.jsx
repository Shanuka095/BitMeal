import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/public/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch details');
      }
    };
    fetchDetails();
  }, [id]);

  if (error) return <div className="p-6 text-center"><p className="text-red-600">{error}</p></div>;
  if (!restaurant) return <div className="p-6 text-center"><p className="text-gray-600">Loading...</p></div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>
      <p className="text-gray-600 mb-4"><strong>Address:</strong> {restaurant.address}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menu</h2>
      {restaurant.menu && restaurant.menu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {restaurant.menu.map((item) => (
            <div key={item._id || item.name} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <p className="text-lg font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-600">${item.price}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No menu items available</p>
      )}
      <button
        className="bg-[#ffaa00] text-white px-6 py-3 rounded-lg hover:bg-[#e59400] transition duration-200"
        onClick={() => alert('Order functionality to be implemented')}
      >
        Order Now
      </button>
    </div>
  );
};

export default RestaurantDetails;