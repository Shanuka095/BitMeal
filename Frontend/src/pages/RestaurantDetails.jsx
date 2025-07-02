import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          // Handle invalid token, e.g., clear it and force re-login
          if (sessionKey) sessionStorage.removeItem(sessionKey);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

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

  const handleBuyClick = async (menuItem) => {
    setOrderMessage('');
    if (userRole !== 'customer') {
      setOrderMessage('Error: Only customers can place orders. Please log in as a customer.');
      return;
    }

    try {
      // Get token from sessionStorage
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setOrderMessage('Please log in to place an order.');
        return;
      }

      const deliveryAddress = prompt("Please enter your delivery address:");
      if (!deliveryAddress) {
        setOrderMessage('Delivery address is required to place an order.');
        return;
      }

      const orderItems = [{
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      }];

      const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderData = {
        restaurantId: restaurant._id,
        items: orderItems,
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress,
      };

      const response = await axios.post('http://localhost:3000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setOrderMessage(`Order placed successfully! Order ID: ${response.data._id}`);
      console.log('Order created:', response.data);

    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order.';
      setOrderMessage(`Error: ${msg}`);
      console.error('Order placement error:', err.response ? err.response.data : err);
    }
  };

  if (loading) return <div className="p-6 text-center"><p className="text-gray-600">Loading...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-red-600">{error}</p></div>;
  if (!restaurant) return <div className="p-6 text-center"><p className="text-gray-600">Restaurant not found</p></div>;

  return (
    <div className="p-6 pt-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">{restaurant.name}</h1>
      {restaurant.imageUrl && (
        <div className="mb-8 flex justify-center">
          <img
            src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
            alt={restaurant.name}
            className="w-full max-w-lg h-80 object-cover rounded-xl shadow-xl border border-gray-200"
          />
        </div>
      )}
      <p className="text-lg text-gray-700 mb-8 text-center"><strong>Address:</strong> {restaurant.address}</p>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Menu</h2>

      {orderMessage && (
        <div className={`p-3 mb-4 rounded-md text-center ${orderMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {orderMessage}
        </div>
      )}

      {restaurant.menu && restaurant.menu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {restaurant.menu.map((item) => (
            <div key={item._id || item.name} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between border border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-700 font-bold mb-1">Rs. {item.price}</p>
                <p className="text-sm text-gray-500 mb-3">Category: {item.category}</p>
                {item.imageUrl && (
                  <img
                    src={`http://localhost:3003/uploads/${item.imageUrl}`}
                    alt={item.name}
                    className="mt-2 w-full h-40 object-cover rounded-md shadow-sm"
                  />
                )}
              </div>
              {userRole === 'customer' ? (
                <button
                  onClick={() => handleBuyClick(item)}
                  className="mt-5 bg-[#ffaa00] text-white px-5 py-2.5 rounded-lg hover:bg-[#e59400] transition duration-200 self-start font-semibold shadow-md hover:shadow-lg"
                >
                  Buy
                </button>
              ) : (
                <p className="mt-5 text-sm text-gray-500">Log in as customer to buy</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg">No menu items available for this restaurant.</p>
      )}
    </div>
  );
};

export default RestaurantDetails;
