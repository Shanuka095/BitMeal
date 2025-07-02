import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/public/${id}`);
        console.log('Frontend (RestaurantDetails) - Response:', response.data);
        setRestaurant(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        console.error('Frontend (RestaurantDetails) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Function to handle the "Buy" button click for a specific menu item
  const handleBuyClick = (itemName, itemPrice) => {
    // In a real application, this would add the item to a cart,
    // initiate an order, or navigate to a checkout page.
    alert(`You clicked "Buy" for: ${itemName} (Rs. ${itemPrice})`);
    // Example: navigate('/checkout', { state: { item: { name: itemName, price: itemPrice } } });
  };

  if (loading) return <div className="p-6 text-center"><p className="text-gray-600">Loading...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-red-600">{error}</p></div>;
  if (!restaurant) return <div className="p-6 text-center"><p className="text-gray-600">Restaurant not found</p></div>;

  return (
    <div className="p-6 pt-24"> {/* Added pt-24 to push content below Navbar */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>
      {restaurant.imageUrl && (
        <img
          src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
          alt={restaurant.name}
          className="mb-4 w-64 h-64 object-cover rounded"
        />
      )}
      <p className="text-gray-600 mb-4"><strong>Address:</strong> {restaurant.address}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menu</h2>
      {restaurant.menu && restaurant.menu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {restaurant.menu.map((item) => (
            <div key={item._id || item.name} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
              <div>
                <p className="text-lg font-medium text-gray-800">{item.name}</p>
                {/* Changed price display to Sri Lankan Rupees */}
                <p className="text-gray-600">Rs. {item.price}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
                {item.imageUrl && (
                  <img
                    src={`http://localhost:3003/uploads/${item.imageUrl}`}
                    alt={item.name}
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
              {/* "Buy" button moved inside the menu item card */}
              <button
                onClick={() => handleBuyClick(item.name, item.price)}
                className="mt-4 bg-[#ffaa00] text-white px-4 py-2 rounded-lg hover:bg-[#e59400] transition duration-200 self-start"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No menu items available</p>
      )}
    </div>
  );
};

export default RestaurantDetails;
