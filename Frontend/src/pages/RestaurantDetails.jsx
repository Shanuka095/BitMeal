import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [groupedMenu, setGroupedMenu] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          if (sessionKey) sessionStorage.removeItem(sessionKey);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/public/${id}`);
        setRestaurant(response.data);

        const menu = response.data.menu || [];
        const newGroupedMenu = menu.reduce((acc, item) => {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});
        setGroupedMenu(newGroupedMenu);

        const initialSizes = {};
        menu.forEach(item => {
          initialSizes[item._id] = 'normal';
        });
        setSelectedSizes(initialSizes);

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        console.error('Frontend (RestaurantDetails) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSizeChange = (menuItemId, size) => {
    setSelectedSizes(prevSizes => ({
      ...prevSizes,
      [menuItemId]: size,
    }));
  };

  const getPrice = (item) => {
    const selectedSize = selectedSizes[item._id];
    // FIX: Add || 0 to handle cases where normalPrice or extraPriceForFull might be undefined
    const normalPrice = item.normalPrice || 0;
    const extraPriceForFull = item.extraPriceForFull || 0;

    if (selectedSize === 'full' && extraPriceForFull > 0) {
      return normalPrice + extraPriceForFull;
    }
    return normalPrice;
  };

  const handleBuyClick = async (menuItem) => {
    setOrderMessage('');
    if (userRole !== 'customer') {
      setOrderMessage('Error: Only customers can place orders. Please log in as a customer.');
      return;
    }

    try {
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

      const selectedPrice = getPrice(menuItem);

      const orderItems = [{
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: selectedPrice,
        quantity: 1,
        size: selectedSizes[menuItem._id],
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

  const scrollToCategory = (category) => {
    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return <div className="p-6 text-center pt-24"><p className="text-gray-600">Loading...</p></div>;
  if (error) return <div className="p-6 text-center pt-24"><p className="text-red-600">{error}</p></div>;
  if (!restaurant) return <div className="p-6 text-center pt-24"><p className="text-gray-600">Restaurant not found</p></div>;

  const categories = Object.keys(groupedMenu);

  return (
    <div className="p-6 pt-24 max-w-7xl mx-auto flex flex-col lg:flex-row">
      {/* Restaurant Header */}
      <div className="w-full lg:w-3/4 lg:pr-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">{restaurant.name}</h1>
        {restaurant.imageUrl && (
          <div className="mb-8 flex justify-center lg:justify-start">
            <img
              src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
              alt={restaurant.name}
              className="w-full max-w-lg h-80 object-cover rounded-xl shadow-xl border border-gray-200"
            />
          </div>
        )}
        <p className="text-lg text-gray-700 mb-8 text-center lg:text-left"><strong>Address:</strong> {restaurant.address}</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">Menu</h2>

        {orderMessage && (
          <div className={`p-3 mb-4 rounded-md text-center ${orderMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {orderMessage}
          </div>
        )}

        {/* Menu Items Grouped by Category */}
        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category} ref={el => categoryRefs.current[category] = el} className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#ffaa00] pb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {groupedMenu[category].map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between border border-gray-100">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h4>
                        {item.imageUrl && (
                          <img
                            src={`http://localhost:3003/uploads/${item.imageUrl}`}
                            alt={item.name}
                            className="mt-2 w-full h-40 object-cover rounded-md shadow-sm mb-3"
                          />
                        )}
                        <div className="flex items-center space-x-4 mb-3">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`size-${item._id}`}
                              value="normal"
                              checked={selectedSizes[item._id] === 'normal'}
                              onChange={() => handleSizeChange(item._id, 'normal')}
                              className="form-radio h-4 w-4 text-[#ffaa00] focus:ring-[#ffaa00]"
                            />
                            <span className="ml-2 text-gray-700 font-medium">Normal (Rs. {(item.normalPrice || 0).toFixed(2)})</span> {/* FIX: Add || 0 and toFixed(2) */}
                          </label>
                          {(item.extraPriceForFull || 0) > 0 && ( // FIX: Add || 0
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`size-${item._id}`}
                                value="full"
                                checked={selectedSizes[item._id] === 'full'}
                                onChange={() => handleSizeChange(item._id, 'full')}
                                className="form-radio h-4 w-4 text-[#ffaa00] focus:ring-[#ffaa00]"
                              />
                              <span className="ml-2 text-gray-700 font-medium">
                                Full (+Rs. {(item.extraPriceForFull || 0).toFixed(2)}) {/* FIX: Add || 0 and toFixed(2) */}
                              </span>
                            </label>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          Price: Rs. {getPrice(item).toFixed(2)}
                        </p>
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">No menu items available for this restaurant.</p>
        )}
      </div>

      {/* Category Navigation (Right Side) */}
      {categories.length > 0 && (
        <div className="w-full lg:w-1/4 lg:pl-8 mt-10 lg:mt-0 sticky top-24 self-start">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Menu Categories</h3>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => scrollToCategory(category)}
                    className="w-full text-left p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#ffaa00] transition duration-200 font-medium"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
